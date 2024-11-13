# pld-discord-webhook
A python script that impliments [hazemn's pls donate stream alerts](https://x.com/secrethazem/status/1851056785689321476) as a streamer widget 

<br>How to display the widget on your streaming software: https://blog.pulsoid.net/post/how-to-add-browser-source-in-obs-streamlabs-obs-twitch-studio-xsplit#:~:text=Adding%20a%20new%20Browser%20Source:%20Click%20'+'%20in%20Sources,is%20Streamlabs%20OBS%20App%20Store.

Note: the current setup means offline donations are *not* registered, this would put a lot of stress on the servers and is something you would need to choose to impliment yourself, only donations when you have the widget loaded (ex during a stream) are counted.

<br><br>Remember, you can change any of this code to better fit your wants/needs, just please credit me if you plan to redistribute :)
## installation
via git:
```git clone https://github.com/cosmaticdev/pld-embeds```
<br>(or you can always just copy and paste the code into python and html files - remember to make a static directory and copy the html!)

Then get the necesary packages... ``` pip install fastapi uvicorn websockets ```


## setting up the site
- once you have all your files downloaded, put it all into a single directory (server.py, static)
- You can run the site through any python IDE or terminal, just make sure you have python installed. If you are using a IDE or terminal go to the directory the script is in and run the script (python server.py, run button, etc).
- Host the site, this can either be through your pc on a local ip or a server that you host on a domain (this is wayyyy to complex to explain here, google how to host a python site yourself, theres some really nice guides)

## testing your setup
You can do a test by navigating to your website (whether its a domain or ip - make sure you have the right port!) and checking if the widget builder screen appears - if it does, you should be all set! It's not harmful to check if the widget is functioning properly by putting it into streamlabs either!

## need more help?
Feel free to send me a DM on discord: @cosmatic_

<br><br>
Copyright 2024 cosmatic

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
