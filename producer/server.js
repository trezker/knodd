'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/api/producer/Create_producer', (req, res) => {
	res.send('Creating producer\n');
});
app.get('/api/producer/Create_product', (req, res) => {
	res.send('Creating product\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
