var config  = require('../../config');
var Rating = require('../models/rating');
var request = require('request'); //http request package
var mongoose = require('mongoose');



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
	collection.update({"id":ratings},{$set:{drinksAverage:average}});
}

function updateUserRating(User , data)
{
	var User;
	// wait for this part, pass a user and rating
	
	
	for(i = 0;i<data.userIds.length;i++) // search for the user
	{
		if(User.username == data.userIDs[i])
		{
			//collection.update({"id":ratings}, {$set:{drinksRating[i]:data.drinksRating[i]}});
			// it doesn't like the i on the first drinksRating
		}
	}
	

}




module.exports = {
	getRequest:getRequest,
	calcAverage:calcAverage,
	updateUserRating:updateUserRating,
}