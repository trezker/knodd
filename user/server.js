'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

async function setup_database() {
	let conn;
	try {
		await sleep(1000);
		const dbpool = mariadb.createPool({
			host: 'db', 
			user:'root', 
			password: process.env.DB_ROOT_PASSWORD,
			connectionLimit: 5
		});

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