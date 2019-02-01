'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const dbpool = mariadb.createPool({
	host: 'db', 
	user:'root', 
	password: 'example',
	connectionLimit: 5
});

async function setup_database() {
	let conn;
	try {
		conn = await dbpool.getConnection();
		console.log(conn);
		const rows = await conn.query("SELECT 1 as val");
		//console.log(rows); //[ {val: 1}, meta: ... ]
		//const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
		//console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
	} catch (err) {
		throw err;
	} finally {
		if (conn) return conn.end();
	}
}

setup_database();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const sign_up_module = require("./sign_up");
var sign_up = new sign_up_module.initialize(dbpool);

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
