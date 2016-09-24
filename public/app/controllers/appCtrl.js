// We will put app logic here.
angular.module('appCtrl', [])
	.controller('appController', function() 
	{


	})
	.controller('searchController', function(App) 
	{
		var vm = this;

		vm.searchIng = function() 
		{
			App.getIngredient(vm.searchString)
				.then(function(data) 
				{
					if(data.data.ingredients) 
					{
						console.log(data.data.ingredients[0]);
						//vm = App.getByDrink(vm.searchString).then(function(data.data));
					
					}
				});
				
				//var drinks = getByDrink(vm.searchString).then(function(data.data));
				
			
		}
		



		

	});