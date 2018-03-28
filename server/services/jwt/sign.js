const Async = require('crocks/Async')
const curry = require('crocks/helpers/curry')
const jwt = require('jsonwebtoken')

const sign = curry(
	(secret, payload) => Async(
		(rej, res) =>
			jwt.sign(payload, secret, (err, token) => err ? rej(err) : res(token))
	)
)

module.exports = {
	sign
}