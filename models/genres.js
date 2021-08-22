const Joi = require("joi");
const mongoose = require("mongoose");

const Genres = new mongoose.model(
  "genres",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
  })
);

function validateGenres(genre) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
  };
  return Joi.validate(genre, schema);
}

module.exports.Genres = Genres;
module.exports.validate = validateGenres;
