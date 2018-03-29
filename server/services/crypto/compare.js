const Async = require('crocks/Async')
const bcrypt = require('bcrypt')
const curry = require('crocks/helpers/curry')

const error = { statusCode: 402, message: 'Password does not match.' }

const compare = curry(
	(text, hash) =>
		Async(
			(rej, res) => bcrypt
				.compare(text, hash)
				.then(
					bool => bool === true
						? res(true)
						: rej(error)
				)
				.catch(rej)
		)
)

module.exports = compare