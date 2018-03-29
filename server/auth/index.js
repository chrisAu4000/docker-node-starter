const Async = require('crocks/Async')
const assign = require('crocks/helpers/assign')
const chain = require('crocks/pointfree/chain')
const curry = require('crocks/helpers/curry')
const fanout = require('crocks/helpers/fanout')
const identity = require('crocks/combinators/identity')
const maybeToAsync = require('crocks/Async/maybeToAsync')
const prop = require('crocks/Maybe/prop')
const router = require('express').Router()
const crypto = require('../services/crypto/hash')
const User = require('./User')

// mapRight : Functor f => (a -> b -> c) -> Pair a (f b) -> f c
const mapRight = f => (l, r) => r.map(f(l))

const registrationData = curry((name, email, password) =>
	({ name, email, password })
)

const mkRegistrationData = req => Async
	.of(registrationData)
	.ap(maybeToAsync('name is required', prop('name', req.body)))
	.ap(maybeToAsync('email is required', prop('email', req.body)))
	.ap(maybeToAsync('password is required', prop('password', req.body)))

const hash = str => crypto.hash(Math.round(Math.random() * 10), str)

const setPassword = mapRight(curry((a, hash) => assign({ password: hash }, a)))

const hashPassword = registrationData =>
	fanout(identity, prop('password'), registrationData)
		.map(maybeToAsync('password is required'))
		.map(chain(hash))
		.merge(setPassword)

module.exports = (connection) => {
	const user = User(connection)
	router.post('/register',
		(req, res) => mkRegistrationData(req)
			.chain(hashPassword)
			.chain(user.insert)
			.fork(
				err => res.status(400).json({ statusCode: 400, message: err }),
				suc => res.json(suc)
			)
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