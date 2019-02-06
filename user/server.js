'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');


async function setup_database() {
	let dbpool;
	var success = false;
	while(!success) {
		try
		{
			dbpool = mariadb.createPool({
				host: 'db', 
				user:'root', 
				password: process.env.DB_ROOT_PASSWORD,
				connectionLimit: 5
			});
			success = true;
		}
		catch(err) {
			console.log("fail");
		}
	}
	console.log("success");
	let conn;
	try {
		conn = await dbpool.getConnection();
		//console.log(conn);
		await conn.query(`
			CREATE DATABASE IF NOT EXISTS user
			CHARACTER SET utf8 COLLATE utf8_unicode_ci
		`);
		await conn.query(`
			CREATE USER IF NOT EXISTS 'user_service'@'%' IDENTIFIED BY '` + process.env.DB_USER_SERVICE_PASSWORD + `'
		`);
		await conn.query(`
			GRANT INSERT, UPDATE, SELECT, DELETE, EXECUTE, TRIGGER ON user.* to 'user_service'@'%'
		`);
		await conn.query(`
			USE user
		`);
		await conn.query(`
			CREATE TABLE IF NOT EXISTS user (
				id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
				name VARCHAR(64) UNIQUE
			)
			ENGINE=InnoDB
		`);
		await conn.query(`
			CREATE TABLE IF NOT EXISTS credential (
				id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
				user_id BIGINT NOT NULL,
				type ENUM('password'),
				value VARCHAR(256) NOT NULL,
				FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
			)
			ENGINE=InnoDB
		`);
		//console.log(rows); //[ {val: 1}, meta: ... ]
		//const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
		//console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
	} catch (err) {
		console.log(err);
		//throw err;
	} finally {
		if (conn) return conn.end();
	}
}

(async () => {
await setup_database();

const dbpool = mariadb.createPool({
	host: 'db', 
	user:'user_service', 
	database: 'user',
	password: process.env.DB_USER_SERVICE_PASSWORD,
	connectionLimit: 5
});

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

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
};

app.post('/api/user/sign_up', asyncMiddleware(async (req, res, next) => { await sign_up.handler(req, res); }));
app.get('/api/user/log_in', (req, res) => {
	res.send('Logging in\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
})();