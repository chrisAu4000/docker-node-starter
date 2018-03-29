const Async = require('crocks/Async')
const curry = require('crocks/helpers/curry')
const objOf = require('crocks/helpers/objOf')
const pipe = require('crocks/helpers/pipe')

const prodErrs = mongoErr => {
	switch (mongoErr.code.toString()) {
	case '11000':
		return 'Duplication Error'
	default:
		return 'Unknown Error'
	}
}

const toObject = doc => Async((rej, res) => doc
	? res(doc.toObject())
	: rej({ statusCode: 404, message: 'Not Found' })
)

const toError = mongoErr => {
	return {
		statusCode: 401,
		message: process.env.NODE_ENV === 'develop'
			? mongoErr.errmsg
			: prodErrs(mongoErr)
	}
}

module.exports = (connection) => {
	const User = connection.models.User
	const insert = data => Async(
		(rej, res) => User
			.create(data)
			.then(res)
			.catch(pipe(toError, rej)))
		.chain(toObject)

	const findOneBy = curry((propName,data) => Async(
		(rej, res) => User
			.findOne(objOf(propName, data[propName]))
			.then(res)
			.catch(pipe(toError, rej)))
		.chain(toObject))

	return {
		insert,
		findOneBy
	}
}