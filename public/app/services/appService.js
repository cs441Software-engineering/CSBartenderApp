// Our authService, handles authentication with our backend server.
angular.module('appService', [])
	.factory('App', function($http, $window, $q) {
		var appFactory = {};

		appFactory.getIngredient = function(name) {
			return $http.get('/api/ingredient/' + name);
		};

		appFactory.getDrinkBy = function(ing) {
			return $http.get('/api/getDrinkByIngredient/' + ing);
		};

		//search query
		appFactory.getDrinkSearch = function(ing) {
			console.log(ing);
			return $http.get('/api/getDrinkBySearch/' + ing);
		};

		appFactory.addIngredient = function(name) {
			console.log("eggs");
			return $http.post('/api/addIngredient', {
				ingredientName: name
			});
		};

		appFactory.addDrink = function(name, drinkOccasions, drinkDescription, drinkIngredients, drinkIDField) {
			console.log("bacon");
			return $http.post('/api/addDrink', {
				drinkName: name,
				drinkOccasion: drinkOccasions,
				drinkDescription: drinkDescription,
				drinkIngredient: drinkIngredients,
				drinkID: drinkIDField
			});
		};

		return appFactory;
	});
