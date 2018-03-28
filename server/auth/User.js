const Async = require('crocks/Async')

const toObject = doc => doc.toObject()

module.exports = (connection) => {
	const User = connection.models.User
	const insert = data => Async(
		(rej, res) => User
			.create(data)
			.then(toObject)
			.then(res)
			.catch(rej)
	)
	return {
		insert
	}
}