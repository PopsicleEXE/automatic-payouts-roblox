let roblox = require('noblox.js')
let config = require('../config.json')

function SendResponse(res, json, status) { // Function for ease of sending response
	res.status(status).send(json);
}

function Authenticate(req, res, next_func) {
	if (req.body.auth_key === config.auth_key) { // Does the request's key match the key in our config?
		next_func();
	} else {
		SendResponse(res, { error: 'Incorrect authentication key.' }, 401)
	}
}

function SendPayout(res, Group, Target, Robux) {
	return new Promise(function (resolve, reject) {

		roblox.groupPayout({group: Group, member: Target, amount: Robux})
	});
}

module.exports = {
	SendPayout: SendPayout,
	Authenticate: Authenticate,
}