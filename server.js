const express = require('express')
const serveStatic = require("serve-static")
const compression = require('compression');
var history = require('connect-history-api-fallback')
const path = require('path')

app = express()

app.use(compression());

app.use(history({
	verbose: true
}))

app.use(serveStatic(path.join(__dirname, 'dist'), {
	maxAge: '1d',
	fallthrough: true,
	index: ['index.html'],
}))

const port = process.env.PORT || 3000
app.listen(port)