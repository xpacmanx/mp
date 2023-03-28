const express = require('express')
const serveStatic = require("serve-static")
const basicAuth = require('express-basic-auth')

var history = require('connect-history-api-fallback')
const path = require('path')

app = express()

app.use(basicAuth({
	users: { 'admin': 'Nikola1856' },
	challenge: true,
	realm: 'Imb4T3st4pp',
}))

app.use(history({
	verbose: true
}))

app.use(serveStatic(path.join(__dirname, 'dist')))

const port = process.env.PORT || 3000
app.listen(port)