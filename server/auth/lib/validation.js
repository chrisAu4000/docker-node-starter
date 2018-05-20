const curry = require('crocks/helpers/curry')
const maybeToAsync = require('crocks/Async/maybeToAsync')
const prop = require('crocks/Maybe/prop')

const required = curry(
	(propName, obj) => maybeToAsync(
		{ message: `${propName} is required.`, statusCode: 400 }
		, prop(propName, obj)
	)
)

module.exports = {
	required
}