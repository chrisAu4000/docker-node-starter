const jwt = require('../../services/jwt')
const map = require('crocks/pointfree/map')
const maybeToAsync = require('crocks/Async/maybeToAsync')
const propPath = require('crocks/Maybe/propPath')
const pipe = require('crocks/helpers/pipe')

const extractToken = propPath([ 'headers', 'authorization' ])
const removeBearer = str => str.replace('Bearer ', '')
const getToken = pipe(extractToken, map(removeBearer))

const authenticate =
	(user, req) => maybeToAsync('No token provided', getToken(req))
		.chain(jwt.verify('secret'))

module.exports = authenticate