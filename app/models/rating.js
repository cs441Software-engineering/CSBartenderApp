// Import our requirements.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Declare a Mongoose Schema.
// Tells mongodb what values it will store.
var RatingSchema = new Schema({
	drinksRating: {
		type: [Number], //rating 1-5
		required: true,
		index: {
			unique: true
		}
	},
	
	drinksAverage:{
		type: Number,
		required: true,
	},
		
	drinkNames : {
		type: String, //add drink name into this one
		required: true
	},
	
	userIDs :{
		type:[String], //array to hold the users. Check this to update a users rating
		required: true,
		
	},

});

module.exports = mongoose.model('Rating', RatingSchema);