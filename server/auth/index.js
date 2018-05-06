const Async = require('crocks/Async')
const assign = require('crocks/helpers/assign')
const chain = require('crocks/pointfree/chain')
const constant = require('crocks/combinators/constant')
const curry = require('crocks/helpers/curry')
const fanout = require('crocks/helpers/fanout')
const identity = require('crocks/combinators/identity')
const jwt = require('../services/jwt')
const map = require('crocks/pointfree/map')
const maybeToAsync = require('crocks/Async/maybeToAsync')
const merge = require('crocks/Pair/merge')
const pipe = require('crocks/helpers/pipe')
const prop = require('crocks/Maybe/prop')
const router = require('express').Router()
const crypto = require('../services/crypto')
const User = require('./User')

// mapRight : Functor f => (a -> b -> c) -> Pair a (f b) -> f c
const mapRight = f => (l, r) => r.map(f(l))

const required = curry(
	(propName, obj) => maybeToAsync(
		{ message: `${propName} is required.`, statusCode: 400 }
		, prop(propName, obj)
	)
)

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

const loginData = curry((email, password) => ({ email, password }))

const mkLoginData = req => Async
	.of(loginData)
	.ap(required('email', req.body))
	.ap(required('password', req.body))

const comparePasswords = merge((pwd, user) => Async
	.of(crypto.compare)
	.ap(pwd)
	.ap(user.chain(required('password')))
	.chain(chain(constant(user)))
)

const setJwt = mapRight(curry((user, token) => ({ user, jwt: token })))

const sign = pipe(
	fanout(identity, jwt.sign('secret')),
	merge(setJwt)
)

module.exports = (connection) => {
	const user = User(connection)
	router.post('/register',
		(req, res) => mkRegistrationData(req)
			.chain(hashPassword)
			.chain(user.insert)
			.fork(
				err => res.status(err.statusCode).json(err),
				suc => res.json(suc)
			)
	)
	router.post('/login',
		(req, res) => mkLoginData(req)
			.map(fanout(required('password'), identity))
			.map(map(user.findOneBy('email')))
			.chain(comparePasswords)
			.chain(sign)
			.fork(
				err => res.status(err.statusCode).json(err),
				suc => res.json(suc)
			)
	)

	router.post('/authenticate', (req, res) => {
		const authorization = req.headers.authorization
		jwt.verify('secret', authorization.replace('Bearer ', ''))
			.fork(
				err => res.status(401).json({ message: err.message }),
				user => res.status(200).json(user)
			)
	})
	router.post('/forgot-password',
		(req, res) => res.json({ 'forgot-password': 'forgot-password' })
	)
	router.post('/reset-password',
		(req, res) => res.json({ 'reset-password': 'reset-password' })
	)
	return router
}