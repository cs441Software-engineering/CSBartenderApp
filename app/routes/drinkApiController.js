var config  = require('../../config');
var Ingredient = require('../models/ingredient');
var request = require('request'); //http request package

//Get requests for drink
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
//Given an ingredient get drinks with ingredient
function getDrinksWith(ing_name, done) {
	var href = "http://addb.absolutdrinks.com/drinks/with/" + ing_name + "/?apiKey=" + config.apikey;
	getRequest(href, done);
}

//quick search for drinks. works with search query. pull ingredient ideas from this
function getDrinkQuickSearch(ing_name, done) {
	var href = "http://addb.absolutdrinks.com/quickSearch/drinks/" + ing_name + "/?apikey=" + config.apikey;
	getRequest(href, done);
}

function getIngredientsForDrink(data)
{
	var URLs = [];

	if(data == null)
	{
		return URLs;
	}

	if(data.length == 0 || data.length == null)
	{
		return URLs;
	}


	if (data.hasOwnProperty("error"))
	{
		return;
	}

	if (data.result.length == 0) {
		drinksArray += ']';
		return drinksArray;
	}



	var drinkInfo;
	var drinksArray;
	drinksArray = '[';
	if (data.result.length == 0) {
		drinksArray += ']';
		return drinksArray;
	}
	for(x=0; x<data.result.length; x++)
	{
		drinkInfo = 'Drink: ' + x + ' [';
		var Ids = 'IDs: [';
		var Names = 'Names: [';
		var URLs = 'URL: [';
		var placeholder = '';

		URLs += 'http://assets.absolutdrinks.com/drinks/solid-background-white/soft-shadow/floor-reflection/' + data.result[x].id + '.png]'



		for (i=0; i < data.result[x].ingredients.length; i++)//for loop to fill ingredientsID array
		{
			Ids += data.result[x].ingredients[i].id + ', ';
			Names += data.result[x].ingredients[i].textPlain + ', ';
		}
		Ids += ']';
		Names += ']';

		drinkInfo += [data.result[x].id, data.result[0].name,Ids,Names,URLs];
		drinksArray += [drinkInfo];

	}


	console.log(drinksArray);


}

function addIngredient(data) {
	var ingredients = [];
	if (data.hasOwnProperty("error")) {
		return;
	}
	if (data.result.length == 0) {
		return ingredients;
	}
	for (x = 0; x<data.result.length; x++) {
		for (i = 0; i<data.result[x].ingredients.length; i++) {
			var ing = data.result[x].ingredients[i].id;
			var newIng = new Ingredient();
			newIng.name = ing;
			newIng.save();
			ingredients.push(ing);

		}
	}

	console.log(ingredients);
}





module.exports = {
	getRequest:getRequest,
	getDrinksWith:getDrinksWith,
	getDrinkQuickSearch:getDrinkQuickSearch,
	getIngredientsForDrink:getIngredientsForDrink,
	addIngredient:addIngredient
}
