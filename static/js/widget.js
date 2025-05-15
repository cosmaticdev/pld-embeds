let socket;

// Function to get URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        robloxID: params.get('robloxID') || null,
        rounded: params.get('rounded') === 'true',
        borderColor: params.get('borderColor') || '#000000',
        bgColor: params.get('bgColor') || '#ffffff',
        borderWidth: parseInt(params.get('borderWidth')) || 1,
        textSize: parseInt(params.get('textSize')) || 16,
        textFont: params.get('textFont') || 'Arial',
        hPadding: parseInt(params.get('hPadding')) || 10,
        vPadding: parseInt(params.get('vPadding')) || 10,
        showAllTimeMax: params.get('showAllTimeMax') === 'true',
        showMostRecent: params.get('showMostRecent') === 'true',
        showUsername: params.get('showUsername') || 'username'
    };
}

// Function to update widget with JSON data from WebSocket
function updateWidget(data) {
    const widget = document.getElementById("widget");
    const params = getUrlParams();

    // Set widget text based on selected options and incoming data
    let widgetText = "";
    if (params.showAllTimeMax) widgetText += `Highest: ${data.highest.amount}`;
    if (params.showAllTimeMax && params.showMostRecent) widgetText += " | ";
    if (params.showMostRecent) widgetText += `Most Recent: ${data.total}`;
    if (params.showAllTimeMax || params.showMostRecent) {
        widgetText += ` by ${data.highest.username}`;
    }
    widget.innerText = widgetText || "Widget Preview";

    // Apply styles to match the original preview
    widget.style.borderRadius = params.rounded ? "12px" : "0px";
    widget.style.border = `${params.borderWidth}px solid ${params.borderColor}`;
    widget.style.backgroundColor = params.bgColor;
    widget.style.fontSize = `${params.textSize}px`;
    widget.style.fontFamily = params.textFont;
    widget.style.padding = `${params.vPadding}px ${params.hPadding}px`;
}

// Connect to WebSocket and set up message handling
function connectWebSocket() {
    const params = getUrlParams();

    socket = new WebSocket(`wss://${window.location.host}/ws/connect?id=${params.robloxID}`);

    socket.onopen = () => {
        console.log("WebSocket connection established");
        // Request data on connection
        socket.send(JSON.stringify({ "message": "gimme" }));
    };

    socket.onmessage = (event) => {
        try {
            console.log("Received message:", event.data);
            const data = JSON.parse(event.data);
            updateWidget(data); // Update widget with new data
        } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed. Reconnecting...");
        setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
    };
}

// Load widget with URL parameters initially
updateWidget({
    total: 0,
    highest: { amount: 0, id: 0, username: "none" }
});

// Start WebSocket connection
connectWebSocket();

// Send request every 15 seconds for data if the WebSocket is open
setInterval(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ "message": "gimme" }));
    }
}, 15000); // 15 seconds