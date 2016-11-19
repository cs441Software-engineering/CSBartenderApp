// We will put app logic here.
angular.module('appCtrl', [])
	.directive('onError', function() {
	  return {
	    restrict:'A',
	    link: function(scope, element, attr) {
	      element.on('error', function() {
	        element.attr('src', attr.onError);
	      })
	    }
	  }
	})
	.controller('appController', function() {
		var vm = this;

		var drink1 = {
			'pic': 'http://www.stonebrewing.com/sites/default/files/beer/menu/ipa_22_bottle.png',
			'name': 'Stone IPA'
		};

		var drink2 = {
			'pic': 'http://mixnsip.com/wp-content/uploads/2011/02/drink-0586ebe70e4c.jpg',
			'name': 'Appletini'
		};

		var drink3 = {
			'pic': 'http://images.wisegeek.com/cranberry-juice.jpg',
			'name': 'Cranberry Juice'
		};

		vm.drinks = [drink1, drink2, drink3];

	})
	.controller('searchController', function(App) {
		var vm = this;
		vm.ingredients = [];
		vm.drinks = [];
		vm.processing = false;

		vm.searchByIng = function(ingName, addIfReturnsDrink) {
			vm.processing = true;
		}

		vm.toggleInfo = function(drink) {
			if(drink['aboutToggle'] == 'hide') {
				drink['aboutToggle'] = 'show';
				drink['mainToggle'] = 'hide';
			} else {
				drink['mainToggle'] = 'show';
				drink['aboutToggle'] = 'hide';
			}
		}
		
		vm.plainIngredients = function(drink) {
			var ings = drink['ingredients'];
			var ingString = "";
			count = 0;
			lim = ings.length;
			for(i in ings) {
				count++;
				if(count < lim)
					ingString += ings[i]['textPlain'] + ', ';
				else
					ingString += ings[i]['textPlain'];
			}
			return ingString;
		}

		vm.plainOccasions = function(drink) {
			var occ = drink['occasions'];
			var occString = "";
			count = 0;
			lim = occ.length;
			for(i in occ) {
				count++;
				if(count < lim)
					occString += occ[i]['text'] + ', ';
				else
					occString += occ[i]['text'];
			}
			return occString;
		}

		vm.replaceImage = function(drink) {
			console.log(drink);
			drink['image'] = 'assets/img/genericDrink.png';
		}

		vm.queryDrinks = function(ss) {
			vm.processing = true;
			vm.ingredients = [];
			if(vm.searchString != "") {
				App.getDrinkSearch(vm.searchString)
				.then(function(data) {
					vm.processing = false;
					if(vm.searchString != "" && vm.searchString == ss) {
						if(data.data.success) {
							if(data.data.data.result.length != 0) {
								vm.drinks = data.data.data.result;
								for(drink in vm.drinks) {
									vm.drinks[drink]['mainToggle'] = 'show';
									vm.drinks[drink]['aboutToggle'] = 'hide';
									vm.drinks[drink]['image'] = 'https://assets.absolutdrinks.com/drinks/transparent-background-black/soft-shadow/floor-reflection/'+ vm.drinks[drink]['id'] +'.png';
									vm.drinks[drink]['plainIngredients'] = vm.plainIngredients(vm.drinks[drink]);
									vm.drinks[drink]['plainOccasions'] = vm.plainOccasions(vm.drinks[drink]);
								}
							} else {
								vm.drinks = [];
							}
						} else {
							console.log('Something went wrong getting drinks');
						}
					}
				});
			} else {
				vm.drinks = [];
			}
		}

});