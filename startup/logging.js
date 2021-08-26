const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");
require("dotenv").config();

module.exports = function () {
  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, { db: process.env.db });

  winston.handleExceptions(
    // new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtException.log" })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
