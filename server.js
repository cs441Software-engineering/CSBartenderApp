// Import our requirements.
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var config = require('./config');
// Create an express app.
var app = express();

//socket.io
var socketApp = require('express')();
var http = require('http').Server(socketApp);
var io = require('socket.io')(http);

var userCount = 0;
var userList = [];
var dupeList = [];

io.on('connection', function(socket) {
	userCount++;

	socket.on('send-name', function(name) {
		if(!checkForDupe(name)) {
			console.log(name);
			userList.push(name);
			emitNames(socket, 3000);
		}
	});

	socket.emit('userCount', userCount);
	socket.broadcast.emit('userCount', userCount);
	socket.on('disconnect', function() {
		userCount--;
		userList = [];
		socket.broadcast.emit('update-server-names');
		socket.broadcast.emit('userCount', userCount);
	});
});

checkInDupeList = function(name) {
	var flag = false;
	for(n in dupeList) {
		if (name == dupeList[n])
			flag = true;
	}
	return flag;
}

findAndReplaceDupes = function(name, list) {
	var newList = [];

	for(n in list) {
		if(list[n] != name) 
			newList.push(name); 
	}

	var dupeCount = countDupes(name);
	name = name + ' (' + dupeCount + ')';
	newList.push(name);
	return newList;
}

checkForDupe = function(name) {
	var flag = false;
	for(n in userList) {
		if(name == userList[n])
			flag = true;
	}
	return flag;
}

countDupes = function(name) {
	var count = 1;
	for(n in userList) {
		if(name == userList[n])
			count++;
	}
	return count;
}

emitNames = function(s, t) {
	setTimeout(
		function() {
			s.emit('update-names', userList);
			s.broadcast.emit('update-names', userList);
		}, t
	);
}

http.listen(config.socketPort, function() {
	console.log('Socket is up on port ' + config.socketPort);
});


// Connect to our database.
mongoose.connect(config.database);
// Use morgan to debug, comment out if not needed.
app.use(morgan('dev'));
// User bodyParser to read json from requests.
app.use(bodyParser.json());
// Set our serving directory.
app.use(express.static(__dirname + '/public'));
// Some header and urlencoding stuff.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
	res.setHeader('Access-Control-ALlow-Origin', '*');
	res.setHeader('Access-Control-ALlow-Methods', 'GET, POST');
	res.setHeader('Access-Control-ALlow-Headers', 'X-Requested-With, content-type, Authorization');
	next();
});

// Declare a router for our api.
var apiRoutes = require('./app/routes/api')(app, express);
// It will use the /api endpoint.
app.use('/api', apiRoutes)

// This endpoint will be used to register new users.
// It sits outside our api and above our catchall endpoint.
app.post('/register', function(req, res) {
	if(req.body.username && req.body.password) {
		var User = require('./app/models/user');
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.role_status = 'normal';
		user.save(function(err) {
			if (err) {
				if (err.code == 11000) 
					return res.json({ success: false, message: 'A user with that username already exists. '});
				else 
					return res.json({ success: false, message: err});
			} else {
				return res.json({ success: true, message: 'User created!'});
			}
		});
	} else {
		return res.json({ success: false, message: 'Missing elements'});
	}
});

// Our catchall endpoint. Sends everyone to our index.html file.
app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// Start the app.
app.listen(config.port);
console.log('Server is up on port ' + config.port);