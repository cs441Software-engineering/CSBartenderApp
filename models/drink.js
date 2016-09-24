var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DrinkSchema = new Schema({
	name: {
		type: String,
		index: {
			unique: true
		}
	}
});

module.exports = mongoose.model('Drink', DrinkSchema);