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

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database....."))
  .catch((err) => {
    console.log("Could not connect to database....", err);
  });

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
