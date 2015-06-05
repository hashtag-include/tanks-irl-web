### Websocket example

For Tanks in Real Life, we'll have:
* Node backend
* HTML client (controller)
* Python client (device).

To get this working, make sure you have Python 2.7 and Node installed, then:
* Run `npm install`
* Run `pip install socketIO-client`
* In one instance of command prompt, run `node server.js`
* In another instance of command prompt, run `python client.py`
* Open web browser and navigate to http://localhost:1337 and open the console