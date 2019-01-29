'use strict';

const express = require('express');
const bodyParser = require('body-parser');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const sign_up = require("./sign_up");

// App
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.post('/api/user/sign_up', (req, res) => sign_up.handler(req, res));
app.get('/api/user/log_in', (req, res) => {
	res.send('Logging in\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
