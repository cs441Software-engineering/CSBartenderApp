var config  = require('../../config');
var request = require('request');

//Get requests for drink
function getRequest(href, done) {
	var options = {
		url: href,
		method: 'GET'
	}
	request(options, function(error,message, object){
		if(error) {
			done(null,error);
		}
		else {
			var json = json.parse(object);
			done(json);
		}
	});
}
//Given an ingredient get drinks with ingredient
function getDrinksWith(ing_name, done) {
	var href = "http://addb.absolutdrinks.com/drinks/with/" + ing_name + "?apiKey=" + config.api_key;
	getRequest(href, done);
}

module.exports = {
	getRequest:getRequest,
	getDrinksWith:getDrinksWith
}