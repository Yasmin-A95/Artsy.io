const dotenv = require('dotenv').config()
const express = require('express') // creates our routes
const path = require('path')
const bodyParser = require('body-parser') //  middleware, parses json to express
const mongoose = require('mongoose') // db

mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/login-app-db', { // create a connection with the mongodb database at this url // wtf are we going to do at the point of deployment.. this needs to be turned into an environment variable so that we can deploy.. something about a hostedmongodb service.. (mongodb atlas?)
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express() // creating the http server (express)
app.use('/', express.static(path.join(__dirname, 'static'))) // app.use means use this thing as middleware *this might have an error, this looks like it only works for the root route, investigate*
app.use(bodyParser.json()) // giving app the parser

const port = process.env.PORT || 3000;



const server = require('http').createServer();

const WebSocket = require('ws');
const socketServer = new WebSocket.Server({ server:server });

socketServer.on('connection', ws => {
  console.log('A client has connected');
  
  ws.on('message', message => {
    message = message.toString();
    
    socketServer.clients.forEach(c => {
		// console.log(message) | output: {"x":256,"y":75,"lastX":256,"lastY":75,"width":"10","color":"hsl(146 80% 50%)"}
      c.send(message);
    });
  });
});

server.listen(port, () => {
	console.log('Server up at 3000')
})

server.on('request', app);



