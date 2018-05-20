const Async = require('crocks/Async')
const assign = require('crocks/helpers/assign')
const chain = require('crocks/pointfree/chain')
const curry = require('crocks/helpers/curry')
const crypto = require('../../services/crypto')
const fanout = require('crocks/helpers/fanout')
const identity = require('crocks/combinators/identity')
const pick = require('crocks/helpers/pick')
const prop = require('crocks/Maybe/prop')
const maybeToAsync = require('crocks/Async/maybeToAsync')

const { mapRight } = require('./helper')
const { required } = require('./validation')

const registrationData = curry((name, email, password) =>
	({ name, email, password })
)

const mkRegistrationData = req => Async
	.of(registrationData)
	.ap(required('name', req.body))
	.ap(required('email', req.body))
	.ap(required('password', req.body))

const hash = str => crypto.hash(Math.round(Math.random() * 10), str)

const setPassword = mapRight(curry((a, hash) => assign({ password: hash }, a)))

const hashPassword = registrationData =>
	fanout(identity, prop('password'), registrationData)
		.map(maybeToAsync('password is required'))
		.map(chain(hash))
		.merge(setPassword)

const registration =
	(user, req) => mkRegistrationData(req)
		.chain(hashPassword)
		.chain(user.insert)
		.map(pick([ '_id', 'name', 'email' ]))

module.exports = registration