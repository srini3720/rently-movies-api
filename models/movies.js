const mongoose = require("mongoose");
const Joi = require("joi");
const { Genres } = require("./genres");

const Movies = new mongoose.model(
  "movies",
  new mongoose.Schema({
    title: { type: String, required: true },
    genre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Genres,
      required: true,
    },
    numberInstock: { type: Number, required: true },
    dailyRentalRate: { type: Number, required: true },
  })
);

function validate(movies) {
  const schema = {
    title: Joi.string().required().min(5).max(255),
    genre: Joi.objectId().required().max(255),
    numberInstock: Joi.number().required().max(255),
    dailyRentalRate: Joi.number().required().max(255),
  };
  return Joi.validate(movies, schema);
}

module.exports.Movies = Movies;
module.exports.validate = validate;
