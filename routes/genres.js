const express = require("express");
const router = express.Router();
const Joi = require("joi");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly")
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

router.get("/", async (req, res) => {
  genres = await Genres.find();
  res.send(genres);
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genres.findById(req.params.id);
    res.send(genre);
  } catch {
    return res
      .status(404)
      .send(`Cannot find genres with given id : ${req.params.id}`);
  }
});

router.post("/", async (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await new Genres({
    name: req.body.name,
  });
  genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genres.updateOne(
    { _id: req.params.id },
    {
      name: req.body.name,
    },
    { new: true }
  );
  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  try {
    const genre = await Genres.deleteOne({ _id: req.params.id });
    res.send(genre);
  } catch {
    res.status(400).send(`Cannot find genres with id : ${req.params.id}`);
  }
});

function validateGenres(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
}

module.exports = router;
