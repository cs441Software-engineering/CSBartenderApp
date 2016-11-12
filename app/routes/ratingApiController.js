var config  = require('../../config');
var Rating = require('../models/rating');
var request = require('request'); //http request package


//Get requests for rating
function getRequest(href, done) {
	var options = {
		url: href,
		method: 'GET'
	}
	request(options, function(error, message, object){
		if(error) {
			done(null,error);
		}
		else {
			var json = JSON.parse(object);
			done(json);
		}
	});
}

function calcAverage(data)
{
	var total = 0.0;
	var average = 0.0;
	for(i =0; i<data.drinksRating.length ;i++)
	{
		total+=data.drinksRating[i];
	}
	average = total/data.drinksRating.length;
}

function updateUserRating(data)
{
	var User;
	// how do i assign the user from data?
	
	
	for(i = 0;i<data.userIds.length;i++)
	{
		if(User.username == data.userIDs[i])
		{
			return data.userIDs[i];
		}
	}
	

}




module.exports = {
	getRequest:getRequest,
	calcAverage:calcAverage,
	updateUserRating:updateUserRating,
}