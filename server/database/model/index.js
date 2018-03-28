const glob = require('glob')
const path = require('path')
let models = []

const pwd = path.dirname(__dirname).split(path.sep)
const serverIndex = pwd.indexOf('server')
const serverPath = pwd.slice(0, serverIndex + 1).join(path.sep)

glob.sync(serverPath + '/*/**-model.js').forEach(file => {
	models.push(require(path.resolve(file)))
})

module.exports = models