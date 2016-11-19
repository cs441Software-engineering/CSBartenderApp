// Import our requirements.
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// Declare a Mongoose Schema.
// Tells mongodb what values it will store.
var UserSchema = new Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true,
		select: false
	}
});

// This is middleware that happens before a user is saved
// to the database. It hashes the password so we don't store
// plaintext passwords like noobs.
UserSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password'))
		return next();
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if(err)
			return next(err);
		user.password = hash;
		next();
	});
});

// A function that lets us compare passwords. For use on logging in.
UserSchema.methods.comparePassword = function(password) {
	var user = this;
	return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);