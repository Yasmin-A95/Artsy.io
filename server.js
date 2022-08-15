

const dotenv = require('dotenv').config()
const express = require('express') // creates routes, similar to sinatra but for javaScript - however it ONLY does routes, manual http (headers, content type, parse data that comes in)
const path = require('path')
const bodyParser = require('body-parser') // middleware - this parses any data (json) from the browser to the httpserver (express in this case), and that's passed here! The middleware
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')
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



app.post('/api/change-password', async (req, res) => { // like sinatra routes and/or rails (but routes and controllers combined into one thing)
	const { token, newpassword: plainTextPassword } = req.body // this is our params equivilent - this is object destructuring the object parsed from JSON - body parser turned it into a javascript object!

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' }) // sending JSON back to browser here 
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	try { // try block, try to do these things...
		const user = jwt.verify(token, JWT_SECRET) // what are this?? a way of encoding a users session but how does it work - i do not know // JWT = magic that says this person is logged in and all is well this is to 

		const _id = user.id // JWT's store small things like user.id

		const password = await bcrypt.hash(plainTextPassword, 10) // make it supa secure

		await User.updateOne( // this is a model! Mongoose version // we must read mong docs to understand this shit // a basic mong tutorial will cover us for this // NEED MONGO INSTALLED TO USE THIS!!!! DEPENDANT AS FOOK
			{ _id },
			{
				$set: { password }
			}
		)
		res.json({ status: 'ok' }) // everything went fine!
	} catch (error) { // this happens if there is an error in the try block above (prob wouldnt happen w bcrypt lol but the rest, most likely is the JWT failing to verify, if the session expired or other things)
		console.log(error)
		res.json({ status: 'error', error: ';))' })
	}
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	const user = await User.findOne({ username }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful

		const token = jwt.sign( // sign in
			{
				id: user._id,
				username: user.username
			},
			JWT_SECRET
		)

		return res.json({ status: 'ok', data: token })
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.post('/api/register', async (req, res) => {
	const { username, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)

	try {
		const response = await User.create({
			username,
			password
		})
		console.log('User created successfully: ', response)
	} catch (error) {
		if (error.code === 11000) { // very specific error that can happen in mongodb if we create two things w the same id(username in this case) // duplicate key error ?? is this even possible for us. Maybe
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}

	res.json({ status: 'ok' })
})
const port = process.env.PORT || 3000;


app.listen(port, () => {
	console.log('Server up at 3000')
})
/////////////////////////////

const WebSocket = require('ws');
const server = new WebSocket.Server({ server: app });

server.on('connection', ws => {
  console.log('A client has connected');
  
  ws.on('message', message => {
    message = message.toString();
    console.log(message);
    
    server.clients.forEach(c => {
      c.send(message);
    });
  });
});

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