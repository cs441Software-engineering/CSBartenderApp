// Import our requirements.
var bodyParser = require('body-parser'); 
var User = require('../models/user');
var Ingredient = require('../models/ingredient');
var jwt = require('jsonwebtoken');
var http = require('http');
var config = require('../../config');
var secret = config.secret;
var drinkApi = require ('../../app/routes/drinkApiController');
var Drink = require('../models/drinks');

module.exports = function(app, express) {
	var apiRouter = express.Router();

	// This is our authentication route. If a user provides a valid username & password
	// we will give them a token that allows access to the rest of our api.
	// Notice it is the first route, this is very important.
	apiRouter.post('/authenticate', function(req, res) {
		if(req.body.username && req.body.password) {
			User.findOne({ username: req.body.username }).select('name username password role_status').exec(function(err, user) {
				if(err)
					throw err;
				if(!user) {
					res.json({
						success: false,
						message: 'Authentication failed.'
					});
				} else if(user) {
					var validPassword = user.comparePassword(req.body.password);
					if(!validPassword) {
						res.json({
							success: false,
							message: 'Authentication failed. Wrong username or password.'
						});
					} else {
						var token = jwt.sign({
							name: user.name,
							username: user.username
						}, secret, {
							expiresIn: 60*60*24
						});
						res.json({
							success: true,
							message: 'Token.',
							token: token
						});
					}
				}
			});
		} else {
			res.json({
				success: false,
				message: 'No username or password provided'
			});
		}
	});

	// This is middleware, it sits in the middle between routes. This looks to see if the user
	// has a token. If not, it cannot access anything below it. (This is why it was so important
	// the above route was first)
	apiRouter.use(function(req, res, next) {
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		if(token) {
			jwt.verify(token, secret, function(err, decoded) {
				if(err) {
					res.status(403).send({
						success: false,
						message: 'Invalid token.'
					});
				} else {
					req.decoded = decoded;
					next();
				}
			});
		} else {
			res.status(403).send({
				success: false,
				message: 'No token provided.'
			});
		}
	});

	// The general api endpoint. It is accessed by going to /api
	apiRouter.get('/', function(req, res) {
		res.json({ message: 'Welcome to our API' });
	});

	// This endpoint will send the user a decoded token. Providing username details.
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	apiRouter.get('/getDrinkByIngredient/:ingName', function(req, res) {
		data = http.get({
			host: 'addb.absolutdrinks.com',
			path: '/drinks/with/' + req.params.ingName + '/?apiKey=' + config.apikey
		},function(resp) {
			var body = '';
			resp.on('data', function(d) {
				body += d;
			});
			resp.on('end', function() {
				try {
					var b = JSON.parse(body);
					res.json({
						success: true,
						data: b
					});
				} catch(e) {
					res.json({
						success: false,
						message: 'Invalid value returned from drinks api.'
					});
				}
			});
		});
	});

	//use this for testing and parsing of ingredients
	apiRouter.get('/getDrinkBySearch/:ingName', function (req, res) {
		drinkApi.getDrinkQuickSearch(req.params.ingName, function(data, error) {
				// console.log(data);
				drinkApi.addIngredient(data);//adds ingredient
				drinkApi.getIngredientsForDrink(data);
				res.json({
					success:true,
					data:data
				});
			
		});
	});

	apiRouter.get('/ingredient/:ingName', function(req, res) {
		ingredientName = req.params.ingName
		Ingredient.find({name: new RegExp('^'+ingredientName, "i")}, function(err, ings) {
			if(!err) {
				if(ings.length != 0) {
					res.json({
						success: true,
						ingredients: ings
					});
				} else {
					res.json({
						success: false,
						message: 'Ingredient not found.'
					})
				}
			} else {
				res.status(403).send({
					success: false,
					message: 'Error finding ingredient.'
				});
			}
		});

	});

	apiRouter.post('/addIngredient', function(req, res) {
		if(req.body.ingredientName) {
			var ing = new Ingredient();
			ing.name = req.body.ingredientName;
			//ing.ingredient_id = drinkApi.getDrinkQuickSearch(req.body.ingredientName)
			ing.save(function(err) {
				if (err) {
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A ingredient with that name already exists. '});
					else 
						return res.json({ success: false, message: err});
				} else {
					return res.json({ success: true, message: 'Ingredient created!'});
				}
			});
		} else {
			res.status(403).send({
				success: false,
				message: 'Ingredient name not found.'
			});
		}
	});

	apiRouter.post('/addDrink', function(req, res) {
		if(req.body.drinkName && req.body.drinkOccasion && req.body.drinkDescription && req.body.drinkIngredient && req.body.drinkID) {
			var drin = new Drink();
			var drinkIng = []
			var DI = req.body.drinkIngredient; //DI = drinkIngredient
			for (var x = 0; x<DI.length; x++)
			{
				drinkIng.push(DI[x]);
			}
			console.log(drinkIng);
			drin.name = req.body.drinkName;
			drin.drinkOccasions = req.body.drinkOccasion;
			drin.drinkDescription = req.body.drinkDescription;
			drin.drinkIDField = req.body.drinkID;
			drin.drinkIngredients = drinkIng;
			drin.save(function(err) {
				if(err) { //if there is an error then appropiate message is displayed
					if (err.code == 11000)
						return res.json({success: false, message: 'A drink with that name already exist'});
					else
						return res.json({success: false, message: err});
				}
				else { //if there is no error then the drink is added to the database
					return res.json({success: true, message: 'Drink created!'});
				}
			});
		}
		else { //error checks 1st if statement
			res.status(403).send({
				success: false,
				message: 'drink parimeter not filled out'
			});
		}
	});

	return apiRouter;
};