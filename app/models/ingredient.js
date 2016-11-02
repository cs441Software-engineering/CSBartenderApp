var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IngSchema = new Schema({
	name: { //used to store id now
		type: String,
		required: true,
		index: {
			unique: true
		}
	

	}

});

module.exports = mongoose.model('Ingredient', IngSchema);