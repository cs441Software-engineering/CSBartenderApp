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
	var av = 0.0;
	for(i =0; i<data.drinksRating.length ;i++)
	{
		total+=data.drinksRating[i];
	}
	av = total/data.drinksRating.length;

	
	collection.findAndModify({
		query: {drinkNames: "data.drinkNames"},
		update: { $inc: {drinksAverage:av}},
		upsert:true
	})
}

function updateUserRating(User , data)
{
	var User;
	// wait for this part, pass a user and rating
	
	
	for(i = 0;i<data.usersNratings.length;i++) // search for the user
	{
		if(User.username == data.usersNratings.userIds[i])
		{
				collection.findAndModify({
					query:{drinkNames: "data.drinkNames"},
					update:{$inc:{userIds[i]:newRating}}, //it still doesn't like the array[i]
					update:{$inc:{userRatings[i]:newRating}},//however, we know it's that array slot we want to modify
					upsert:true
				})
		}
		
		collection.findAndModify({
			query:{drinkNames:"data.drinkNames"},
			update:{$push:{userRatings:newRating}},
			update:{$push:{userIds:User.username}},
		})
	}
	

}




module.exports = {
	getRequest:getRequest,
	calcAverage:calcAverage,
	updateUserRating:updateUserRating,
}