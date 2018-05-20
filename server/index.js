const Async = require('crocks/Async')
const Express = require('express')

const bodyParser = require('body-parser')
const cors = require('cors')
const curry = require('crocks/helpers/curry')
const express = Express()
const ip = require('ip')
const morgan = require('morgan')
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
	app.use(cors({ origin: 'http://localhost:3000', optionsSuccessStatus: 200 }))
	app.use(bodyParser.json())
	return app
}

const setupRoutes = curry((app, connection) => {
	if (process.env.NODE_ENV === 'develop') {
		app.use(function (req, res, next) {
			res.header('Access-Control-Allow-Origin', '*')
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-Type, Accept'
			)
			next()
		})
	}
	setupMiddleware(app)
	app.use('/v1/auth', auth(connection))
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