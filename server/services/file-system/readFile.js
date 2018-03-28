const Async = require('crocks/Async')
const fs = require('fs')

// readFile :: (String, String) -> Async e String
const readFile = Async.fromNode(fs.readFile)

module.exports = readFile