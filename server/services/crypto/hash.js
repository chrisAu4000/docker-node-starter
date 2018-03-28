const Async = require('crocks/Async')
const bcrypt = require('bcrypt')
const curry = require('crocks/helpers/curry')

const genSalt = rounds => Async(
	(rej, res) => bcrypt.genSalt(rounds,
		(err, salt) => err ? rej(err): res(salt)
	)
)

const hash = (salt, string) =>
	Async((rej, res) =>
		bcrypt.hash(string, salt).then(res).catch(rej)
	)

module.exports = {
	genSalt,
	hash
}