const dotenv = require('dotenv').config()
const express = require('express') // creates our routes
const path = require('path')
const bodyParser = require('body-parser') //  middleware, parses json to express
const mongoose = require('mongoose') // db

mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/login-app-db', { 
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

const app = express() // creating the http server (express)
app.use('/', express.static(path.join(__dirname, 'static'))) 
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
      c.send(message);
      console.log(message)
    });
  });
});

server.listen(port, () => {
	console.log('Server up at 3000')
})

server.on('request', app);


