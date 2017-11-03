const Async = require('crocks/Async')
const ip = require('ip')
const Express = require('express')
const express = Express()
const dbConnect = require('./database/connect')

const exit = (err) => {
	console.error('ERROR:')
	console.error(err)
	process.exit(1)
}

const run = (app) =>
	console.log(process.env.NODE_ENV + ' listens on: ' + ip.address() + ':' + app.address().port)

const app = (connection) =>
	Async((rej, res) => {
		const server = express.listen(3000, (error) => error
			? rej(error)
			: res(server)
		)
	})
const start = () => dbConnect('mongodb://db:27017/users')
	.chain(app)
	.fork(
		err => exit(err),
		app => run(app)
	)

	module.exports = start