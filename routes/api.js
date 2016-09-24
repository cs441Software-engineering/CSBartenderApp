// Import our requirements.
var bodyParser = require('body-parser'); 
var User = require('../models/user');
var Ingredient = require('../models/ingredient')
var jwt = require('jsonwebtoken');
var config = require('../../config');
var secret = config.secret;

module.exports = function(app, express) {
	var apiRouter = express.Router();

	// This is our authentication route. If a user provides a valid username & password
	// we will give them a token that allows access to the rest of our api.
	// Notice it is the first route, this is very important.
	apiRouter.post('/authenticate', function(req, res) {
		if(req.body.username && req.body.password) {
			User.findOne({ username: req.body.username }).select('name username password').exec(function(err, user) {
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
				success: False,
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
			ing.save(function(err) {
				if (err) {
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A ingredient with that username already exists. '});
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



























	return apiRouter;
};