const startServer = require('./server')
const debug = require('debug')('app')

process.on('unhandledRejection', (reason) => {
	process.env.NODE_ENV === 'develop' && debug(reason)
})

startServer()