const { Genres, validate } = require("../models/genres");
const express = require("express");
const router = express.Router();

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
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await new Genres({
    name: req.body.name,
  });
  genre.save();
  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
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

module.exports = router;