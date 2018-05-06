const Async = require('crocks/Async')
const Express = require('express')

const bodyParser = require('body-parser')
const morgan = require('morgan')
const curry = require('crocks/helpers/curry')
const ip = require('ip')
const express = Express()
const dbConnect = require('./database/connect')
const debug = require('debug')('app')
const auth = require('./auth')


const exit = (err) => {
	debug('ERROR:')
	debug(err)
	process.exit(1)
}

const run = (app) => debug(
	`${process.env.NODE_ENV} listens on: ${ip.address()}:${app.address().port}`
)

const launch = () =>
	Async((rej, res) => {
		const server = express.listen(1337, (error) => error
			? rej(error)
			: res(server)
		)
	})

const setupMiddleware = app => {
	app.use(morgan('dev'))
	app.use(bodyParser.json())
	return app
}

const setupRoutes = curry((app, connection) => {
	setupMiddleware(app)
	app.use('/auth', auth(connection))
	return Async.of(app)
})

const start = () => dbConnect('mongodb://db:27017/users')
	.chain(setupRoutes(express))
	.chain(launch)
	.fork(
		err => exit(err),
		app => run(app)
	)

module.exports = start