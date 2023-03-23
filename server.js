const express = require('express');
const serveStatic = require("serve-static")
const path = require('path');

app = express();

// Use a fallback for non-root routes (required for Vue router)
//   NOTE: History fallback must be "used" before the static serving middleware!
app.use(history({
    // OPTIONAL: Includes more verbose logging
    verbose: true
}))

app.use(serveStatic(path.join(__dirname, 'dist')));

const port = process.env.PORT || 3000;
app.listen(port);