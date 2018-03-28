const Async = require('crocks/Async')
const curry = require('crocks/helpers/curry')
const mongoose = require('mongoose')
const models = require('./model')
const debug = require('debug')('app')

const initializeModel = curry(({ name, schema, collection }) =>
	mongoose.model(name, new mongoose.Schema(schema, { collection: collection }))
)

const connect = (url) => Async((rej, res) => {
	mongoose.Promise = global.Promise
	models.forEach(initializeModel)
	mongoose.connect(url, { useMongoClient: true }).then(connection => {
		connection.once('disconnect',
			() => rej(`Database dissconnected for url: [${url}]`)
		)
		res(connection)
	}).catch(res)
	process.once('SIGINT', () => mongoose.close(() => {
		debug('Mongoose default connection disconnected through app termination')
		process.exit(0)
	}))
})

module.exports = connect