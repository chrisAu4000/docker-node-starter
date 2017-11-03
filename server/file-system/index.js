const {
	chain,
	compose,
	map,
	resultToAsync,
	tryCatch
} = require('crocks')
const fs = require('fs')
const readFile = require('./readFile')
const writeFile = require('./writeFile')

// parseJson :: String a -> Result e a
const parseJson = tryCatch(JSON.parse)
// readJson :: String -> Async e b
const readJson = compose(
	chain(resultToAsync),
	map(parseJson),
	readFile
)

module.exports = {
	readFile,
	readJson,
	writeFile
}