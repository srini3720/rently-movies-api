const express = require("express");
const router = express.Router();
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { User } = require("../models/users");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    await User.findOne({ email: req.body.email });
  } catch {
    return res.status(400).send(`invalid email or password`);
  }

  const user = await User.findOne({ email: req.body.email });
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send(`Invalid email or password`);
  const token =user.generateAuthToken();;
  res.send(token);
});
function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  };
  return Joi.validate(req, schema);
}
module.exports = router;
