const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema( // mongoose version of a model (called a schema, you pull the model out later)
	{
		username: { type: String, required: true, unique: true }, // no duplicate usernames here pls
		password: { type: String, required: true }
	},
	{ collection: 'users' }
)

const model = mongoose.model('UserSchema', UserSchema) // later is now. we're pulling the model out.

module.exports = model
