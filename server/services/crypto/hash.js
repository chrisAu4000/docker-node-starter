const Async = require('crocks/Async')
const bcrypt = require('bcrypt')
const curry = require('crocks/helpers/curry')

const hash = curry((salt, string) =>
	Async((rej, res) =>
		bcrypt.hash(string, salt).then(res).catch(rej)
	)
)

module.exports = hash