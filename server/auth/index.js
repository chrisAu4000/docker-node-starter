const User = require('./User')
const authenticate = require('./lib/authenticate')
const login = require('./lib/login')
const registration = require('./lib/registration')
const router = require('express').Router()

module.exports = (connection) => {
	const user = User(connection)
	router.post('/register',
		(req, res) => registration(user, req)
			.fork(
				err => res.status(err.statusCode).json(err),
				suc => res.json(suc)
			)
	)
	router.post('/login',
		(req, res) => login(user, req)
			.fork(
				err => res.status(err.statusCode).json(err),
				suc => res.json(suc)
			)
	)
	router.post('/authenticate',
		(req, res) => authenticate(user, req)
			.fork(
				err => res.status(401).json({ message: err.message }),
				user => res.json(user)
			)
	)
	router.post('/forgot-password',
		(req, res) => res.json({ 'forgot-password': 'forgot-password' })
	)
	router.post('/reset-password',
		(req, res) => res.json({ 'reset-password': 'reset-password' })
	)
	return router
}