const mongoose = require("mongoose");
const winston = require("winston");
require("dotenv").config();

module.exports = function (dbPath) {
  process.env.NODE_ENV === "test"
    ? (dbPath = "mongodb://localhost/vidly_tests")
    : (dbPath = "mongodb://localhost/vidly");

  mongoose
    .connect(dbPath, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info(`Connected to MongoDB database ${dbPath}`));
};
