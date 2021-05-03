const mongoose = require('mongoose');
const sauceValidation = require('../middleware/sauceValidation');

/** Schema Sauce Mongoose  **/

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true, validate: sauceValidation.nameValidator },
  manufacturer: { type: String, required: true, validate: sauceValidation.manufacturerValidator },
  description: { type: String, required: true, validate: sauceValidation.descriptionValidator },
  mainPepper: { type: String, required: true, validate: sauceValidation.pepperValidator },
  imageUrl: { type: String, required: true, validate: sauceValidation.imageValidator },
  heat: { type: Number, required: true },
  likes: { type: Number, required: false, default: 0 },
  dislikes: { type: Number, required: false, default: 0 },
  usersLiked: { type: [String], required: false },
  usersDisliked: { type: [String], required: false },
});

module.exports = mongoose.model('Sauce', sauceSchema);