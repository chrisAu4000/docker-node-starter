const Async = require('crocks/Async')
const curry = require('crocks/helpers/curry')
const jwt = require('jsonwebtoken')

const verify = curry(
	(secret, token) => Async(
		(rej, res) => jwt.verify(token, secret,
			(err, decoded) => err ? rej(err) : res(decoded))
	)
)

module.exports = verify