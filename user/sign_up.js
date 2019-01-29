module.exports = {
	handler: function(req, res) {
		console.log(req.body.username);
		res.send({ success: false });
	}
}