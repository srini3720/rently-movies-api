const { User, validate } = require("../models/users");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
require("dotenv").config();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.find({ email: req.body.email });
  if (user.length > 0)
    return res
      .status(400)
      .send(`User already exist with given mail ID : ${req.body.email}`);

  const users = await new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  users.password = await bcrypt.hash(users.password, salt);
  users.save();
  const token = users.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(users, ["_id", "name", "email"]));
});

module.exports = router;
