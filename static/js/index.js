var loginViewModel = function() {
	var self = this;
	self.username = '';
	self.password = '';
	self.failed_sign_up = ko.observable(false);
	self.sign_in = function() {
		var data = ko.toJS(this);
		data.model = "user";
		data.action = "Login";
		ajax_post(data).done(function(returnedData) {
			console.log(returnedData);
		    if(returnedData.success == true) {
	    		window.location.href = window.location.href;
		    }
		});
	};

	self.sign_up = function() {
		var data = ko.toJS(this);
		data.action = "user/sign_up";
		ajax_post(data).done(function(returnedData) {
			console.log(returnedData);
			if(returnedData.success == true) {
				loginViewModel.sign_in();
			}
			else
			{
				self.failed_sign_up(true);
			}
		});
	};
};

ko.applyBindings(new loginViewModel());