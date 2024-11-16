import asyncio
import json
import websockets
from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import ssl, os

app = FastAPI()

# Task dictionary for managing WebSocket connections
tasks = {}

# Ensure stats file exists
my_file = Path("stats.json")
if not my_file.is_file():
    with open("stats.json", "w") as f:
        f.write(
            json.dumps({"users": {}, "total": 0, "userstracked": 0, "transactions": 0})
        )


# Process donation data
async def recieve(data, idto):
    with open("stats.json") as f:
        stats = json.loads(f.read())
    stats["total"] += data["amount"]
    stats["users"][idto]["total"] += data["amount"]
    if stats["users"][idto]["highest"]["amount"] <= data["amount"]:
        stats["users"][idto]["highest"] = {
            "amount": data["amount"],
            "id": data["sender"]["id"],
            "username": data["sender"]["username"],
            "displayname": data["sender"]["displayName"],
        }

    stats["transactions"] += 1
    with open("stats.json", "w") as f:
        f.write(json.dumps(stats, indent=2))


# Add a user to tracking database
def add_user(id):
    with open("stats.json") as f:
        stats = json.loads(f.read())
    if str(id) in stats["users"]:
        return
    stats["users"].update(
        {
            id: {
                "total": 0,
                "highest": {
                    "amount": 0,
                    "id": 0,
                    "username": "none",
                    "displayname": "none",
                },
            }
        }
    )

    stats["userstracked"] += 1
    with open("stats.json", "w") as f:
        f.write(json.dumps(stats, indent=2))


# WebSocket connection handler
async def connect_to_websocket(id):
    try:
        uri = f"wss://stream.plsdonate.com/api/user/{id}/websocket"
        async with websockets.connect(uri) as websocket:
            await websocket.send(f"Hello from {id}!")
            print(f"Connected to websocket as {id}")

            while True:
                response = await websocket.recv()
                response = json.loads(response)
                response["sender"]["id"] = str(response["sender"]["id"])
                await recieve(response, id)  # process the data
    except asyncio.CancelledError:
        print(f"Websocket for {id} disconnected")


# WebSocket handler for FastAPI
@app.websocket("/ws/connect")
async def websocket_handler(websocket: WebSocket, id: str):
    await websocket.accept()
    print(f"Client connected with id: {id}")

    if id not in tasks:  # If the user isn't registered yet, add their data
        add_user(id)
        tasks[id] = asyncio.create_task(
            connect_to_websocket(id)
        )  # start tracking donations
    print(f"Serving {len(tasks)} clients")

    try:
        while True:
            message = await websocket.receive_text()
            if json.loads(message)["message"] == "gimme":
                with open("stats.json") as f:
                    data = json.loads(f.read())
                await websocket.send_json(data["users"][str(id)])  # send their data
    except WebSocketDisconnect:
        print(f"Connection with id {id} was disconnected.")
    finally:
        tasks[id].cancel()  # Close the donation tracker
        del tasks[id]
        print(f"Now serving {len(tasks)} clients")
        try:
            await websocket.close()
        except:
            pass


@app.get("/{page_name}")
async def get_page(page_name: str):
    file_path = f"static/{page_name}.html"
    if os.path.exists(file_path):
        return HTMLResponse(open(file_path).read())
    return HTMLResponse("Page not found", status_code=404)


@app.get("/")
async def get_home():
    return HTMLResponse(open("static/home.html").read())


# Static file serving
app.mount("/", StaticFiles(directory="static", html=True), name="static")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=6789)
