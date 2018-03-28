const Async = require('crocks/Async')
const curry = require('crocks/helpers/curry')
const constant = require('crocks/compinators/constant')
const fs = require('fs')

// writeFile :: String -> a -> Async e a
const writeFile = curry(
	(path, data) => Async.fromNode(fs.writeFile)(path, data).map(constant(data))
)

module.exports = writeFile