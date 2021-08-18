const mongoose = require("mongoose");
const Joi = require("joi");

const Rentals = new mongoose.model(
  "rentals",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minLength: 5,
          maxLength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: Number,
          required: true,
          minLength: 5,
          maxLength: 50,
        },
      }),
      requird: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minLength: 5,
          maxLength: 50,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          minLength: 5,
          maxLength: 50,
        },
      }),
      requird: true,
    },
    dateOut: {
      type: Date,
      default: Date.now,
      required: true,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validate(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(rental, schema);
}

module.exports.Rentals = Rentals;
module.exports.validate = validate;
