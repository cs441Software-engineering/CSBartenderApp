// Our main JS logic.
angular.module('mainCtrl', [])
	.controller('mainController', function(Auth, AuthToken, $rootScope, $location) {
		var vm = this;
		vm.loggedIn = Auth.isLoggedIn();

		$rootScope.$on('$routeChangeStart', function() {
			vm.loggedIn = Auth.isLoggedIn();	
			Auth.getUser()
				.then(function(data) {
					vm.user = data.data;
				});	
		});

		if(AuthToken.returnStorageMode()) {
			$location.path('/private');
		}

		vm.doRegister = function() {
			vm.processing = true;
			vm.error = '';
			Auth.registerUser(vm.userData.username, vm.userData.password)
				.success(function(data) {
					if(data.success) {
						Auth.login(vm.userData.username, vm.userData.password)
							.success(function(data) {
								vm.processing = false;
								if(data.success)
									$location.path('/search');
								else
									vm.error = data.message;
							});
					}
				});
		};

		vm.loginRedirect = function() {
			$location.path('/login');
		};

		vm.clickRedirect = function() {
			$location.path('/search');
		}

		vm.doLogout = function() {
			Auth.logout();
			vm.user = null;
			
			$location.path('/');
		}

		vm.doLogin = function() {
			vm.processing = true
			vm.error = '';

			Auth.login(vm.loginData.username, vm.loginData.password)
				.success(function(data) {
					vm.processing = false;
					if(data.success)
						$location.path('/search');
					else
						vm.error = data.message;
				});
		};

});