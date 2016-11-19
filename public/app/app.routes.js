// This page is very important. Angular, the JS framework we are using,
// allows us to declare routes on the front end. This means we can load pages
// as if the website was a single view app. 
angular.module('app.routes', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'app/views/pages/home.html'
			})
			.when('/login', {
				templateUrl: 'app/views/pages/login.html',
				controller: 'mainController',
				controllerAs: 'login'
			})
			.when('/register', {
				templateUrl: 'app/views/pages/register.html',
				controller  : 'mainController',
	    		controllerAs: 'register'
			})
			.when('/app', {
				templateUrl: 'app/views/pages/app.html',
				controller  : 'appController',
	    		controllerAs: 'app'
			})
			.when('/search', {
				templateUrl: 'app/views/pages/search.html',
				controller  : 'searchController',
	    		controllerAs: 'search'
			})
			.when('/private', {
				templateUrl: 'app/views/pages/private.html',
			})
			.when('/:templatePath*', {
				templateUrl: 'app/views/pages/404.html'
			});
		$locationProvider.html5Mode(true);
	});