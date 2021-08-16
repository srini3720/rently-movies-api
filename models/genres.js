const Joi = require("joi");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database...."))
  .catch((err) => {
    console.error("could not connect to database....", err);
  });

const Genres = new mongoose.model(
  "genres",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      min: 3,
      max: 50,
    },
  })
);

function validateGenres(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
}

module.exports.Genres = Genres;
module.exports.validate = validateGenres;
