const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
const genres = require("./routes/genres");
const home = require("./routes/home");
require("dotenv").config();
const customers = require("./routes/customer");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");

if (!process.env.jwtPrivateKey) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}
if (!process.env.PORT) {
  console.error("Localhost not set");
  process.exit(1);
}
app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`listening on http://localhost:${process.env.PORT}`);
});

app.use("/api/genres", genres);
app.use("/", home);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
