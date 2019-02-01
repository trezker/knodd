module.exports = {
	initialize: function(dbpool) {
		var self = this;
		self.dbpool = dbpool;

		self.handler = function(req, res) {
			console.log(req.body.username);
			res.send({ success: false });
		}
	}
}

async function asyncFunction() {
	let conn;
	try {
		conn = await pool.getConnection();
		const rows = await conn.query("SELECT 1 as val");
		console.log(rows); //[ {val: 1}, meta: ... ]
		const res = await conn.query("INSERT INTO myTable value (?, ?)", [1, "mariadb"]);
		console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
	} catch (err) {
		throw err;
	} finally {
		if (conn) return conn.end();
	}
}

function sign_up(dbpool) {
	var self = this;
	self.dbpool = dbpool;
	function attempt(username, password) {
		
	}
}
