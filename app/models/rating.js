// Import our requirements.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// Declare a Mongoose Schema.
// Tells mongodb what values it will store.
var RatingSchema = new Schema({
	drinksRating: {
		type: var, //add drinks into a drink array
		required: true,
		index: {
			unique: true
		}

	drinkNames : {
		type: var, //add drink names into this one
		required: true
	},


	}

});

module.exports = mongoose.model('Rating', RatingSchema);
