const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to database........"))
  .catch((err) => console.error("Could not connect to database", err));
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxlength: 1024,
  },
});
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.jwtPrivateKey);
  return token;
};
const User = new mongoose.model("users", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
