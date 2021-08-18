const Joi = require("joi");
const mongoose = require("mongoose");

function validateCustomer(customer) {
  const schema = {
    isGold: Joi.boolean(),
    name: Joi.string().min(3).required(),
    phone: Joi.number(),
  };
  return Joi.validate(customer, schema);
}

const Customer = new mongoose.model(
  "customers",
  new mongoose.Schema({
    isGold: Boolean,
    name: String,
    phone: {
      type: Number,
    },
  })
);

module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
