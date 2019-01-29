function ajax_post(data) {
	return $.ajax({
		method		: "POST",
		dataType	: 'json',
		contentType	: 'application/json; charset=UTF-8',
		url			: "/api/" + data.action,
		data		: JSON.stringify(data)
	})
}
