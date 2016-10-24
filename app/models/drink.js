//model for drinks

//name
//Drink ABV  = double that stores ABV for entire drink. Caluculated from each ind. Ingredient
//drinkOccasions - string of occasions
//drinkDiscription - brief discription of drink
//drinkIngredients - var since we need an array to store the ingredients
//drinkIDfield - ID to search - comes from API
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DrinkSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},

	//the cards list out occasions/description/ingredients
	drinkOccasions : {
		type: String,
		required: true
	},

		drinkDiscription : {
		type : String,
		required : true
	}

		drinkIngredients : {
		type : var,
		required : true
	}

	//drink ID
	drinkIDField : {
		type : String,
		required : true
	},


});

module.exports = mongoose.model('Drink', DrinkSchema);
