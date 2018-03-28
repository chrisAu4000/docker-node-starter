const Async = require('crocks/Async')
const assign = require('crocks/helpers/assign')
const chain = require('crocks/pointfree/chain')
const curry = require('crocks/helpers/curry')
const fanout = require('crocks/helpers/fanout')
const identity = require('crocks/combinators/identity')
const maybeToAsync = require('crocks/Async/maybeToAsync')
const merge = require('crocks/Pair/merge')
const prop = require('crocks/Maybe/prop')
const router = require('express').Router()
const crypto = require('../services/crypto/hash')
const jwt = require('../services/jwt/sign')
const User = require('./User')

const registrationData = curry((name, email, password) =>
	({ name, email, password })
)

const mkRegistrationData = req => Async
	.of(registrationData)
	.ap(maybeToAsync('name is required', prop('name', req.body)))
	.ap(maybeToAsync('email is required', prop('email', req.body)))
	.ap(maybeToAsync('password is required', prop('password', req.body)))

const hash = str => crypto.hash(Math.round(Math.random() * 10), str)

const hashPassword = registrationData =>
	fanout(identity, prop('password'), registrationData)
		.map(maybeToAsync('password is required'))
		.map(chain(hash))
		.merge((a, hash) =>
			hash.map(hash => assign({ password: hash }, a))
		)


module.exports = (connection) => {
	const user = User(connection)
	// console.log(user)
	router.post('/register',
		(req, res) => {
			return mkRegistrationData(req)
				.chain(hashPassword)
				.chain(user.insert)
				.map(fanout(identity, jwt.sign('secret')))
				.chain(merge(
					(a, t) => t.map(token => ({ jwt: token, user: a }))
				))
				.fork(
					err => res.status(400).json({ status: 400, message: err }),
					suc => res.json(suc)
				)
		}
	)
	router.post('/login',
		(req, res) => res.json({ login: 'login' })
	)
	router.post('/forgot-password',
		(req, res) => res.json({ 'forgot-password': 'forgot-password' })
	)
	router.post('/reset-password',
		(req, res) => res.json({ 'reset-password': 'reset-password' })
	)
	return router
}