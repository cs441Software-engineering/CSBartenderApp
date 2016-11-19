// Import our requirements.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Declare a Mongoose Schema.
// Tells mongodb what values it will store.
var RatingSchema = new Schema({

	drinkNames : {
		type: String, //add drink name into this one
		required: true
	},
	
	drinksAverage:{
		type: Number,
		required: true,
	},
		

	
	usersNratings :[{
		userIds:String,
		userRatings:Number
		
	}],

});

module.exports = mongoose.model('Rating', RatingSchema);