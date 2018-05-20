const Async = require('crocks/Async')
const chain = require('crocks/pointfree/chain')
const constant = require('crocks/combinators/constant')
const crypto = require('../../services/crypto')
const curry = require('crocks/helpers/curry')
const fanout = require('crocks/helpers/fanout')
const identity = require('crocks/combinators/identity')
const jwt = require('../../services/jwt')
const map = require('crocks/pointfree/map')
const merge = require('crocks/Pair/merge')
const pipe = require('crocks/helpers/pipe')

const { mapRight } = require('./helper')
const { required } = require('./validation')

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

const login = (user, req) => mkLoginData(req)
	.map(fanout(required('password'), identity))
	.map(map(user.findOneBy('email')))
	.chain(comparePasswords)
	.chain(sign)

module.exports = login