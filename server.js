const dotenv = require('dotenv').config()
const express = require('express') // creates routes, similar to sinatra but for javaScript - however it ONLY does routes, manual http (headers, content type, parse data that comes in)
const path = require('path')
const bodyParser = require('body-parser') // middleware - this parses any data (json) from the browser to the httpserver (express in this case), and that's passed here! The middleware
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/login-app-db', { // create a connection with the mongodb database at this url // wtf are we going to do at the point of deployment.. this needs to be turned into an environment variable so that we can deploy.. something about a hostedmongodb service.. (mongodb atlas?)

	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})
const app = express() // creating the http server (express)
app.use('/', express.static(path.join(__dirname, 'static'))) // app.use means use this thing as middleware *this might have an error, this looks like it only works for the root route, investigate*
app.use(bodyParser.json()) // configuring the parser

var http = require("http")
var port = process.env.PORT || 5555
// the above two can be moved but the below must stay put
/// the above creates a server that websockets and express can connect to - it's the server for our app // it's basically app.listen but is more compatible with everything we have going on
/////////////////////////////

// two seperate deployments??
// http 
// and 
// websocket
// they both need the port variable
// express is built ontop of nodes http server, I'm creating a normal node http server and then inserting the express app into it
// websockets knows how to connect to the node server, it doesnt know how to connect to express
// if i give it to websockets websockets happy
/////////////////////////////

const server = require('http').createServer();

const WebSocket = require('ws');
const socketServer = new WebSocket.Server({ server:server });

socketServer.on('connection', ws => {

  console.log('A client has connected');
  
  ws.on('message', message => {
    message = message.toString();


    socketServer.clients.forEach(c => {
      c.send(message);
    });
  });
});

server.listen(port, () => {
	console.log('Server up at 5555')
})

server.on('request', app);

var webSocketFactory = {
  connectionTries: 3,
  connect: function(url) {
    var ws = new WebSocket(url);
    ws.addEventListener("error", e => {
      // readyState === 3 is CLOSED
      if (e.target.readyState === 3) {
        this.connectionTries--;

        if (this.connectionTries > 0) {
          setTimeout(() => this.connect(url), 5000);
        } else {
          throw new Error("Maximum number of connection trials has been reached");
        }

      }
    });
  }
};
var webSocket = webSocketFactory.connect("ws://localhost:" + (process.env.PORT || 8080) + "/myContextRoot")