module.exports = {
	initialize: function(dbpool) {
		var self = this;
		self.sign_up = new sign_up(dbpool);

		self.handler = async function(req, res) {
			var result = await self.sign_up.attempt(req.body.username, req.body.password);
			console.log(result);
			res.send(result);
		}
	}
}

function sign_up(dbpool) {
	var self = this;
	self.dbpool = dbpool;
	self.attempt = async function(username, password) {
		var result = {};
		let conn;
		try {
			conn = await self.dbpool.getConnection();
			const res = await conn.query("INSERT INTO user (name) value (?)", [username]);
			result.success = true;
		} catch (err) {
			result.success = false;
		} finally {
			if (conn)
				conn.end();
			return result;
		}
	}
}
