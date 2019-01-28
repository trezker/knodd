'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const signup = require("./signup");

// App
const app = express();
app.get('/api/user/Signup', (req, res) => signup.handler(req, res));
app.get('/api/user/Login', (req, res) => {
	res.send('Logging in\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
