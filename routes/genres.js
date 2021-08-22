const { Genres, validate } = require("../models/genres");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validateObjectId = require("../middleware/validateObjectId");

router.get("/", async (req, res) => {
  genres = await Genres.find();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genres.findById(req.params.id);
  if (!genre) {
    return res
      .status(404)
      .send(`Cannot find genres with given id : ${req.params.id}`);
  }
  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = new Genres({
    name: req.body.name,
  });
  await genre.save();
  res.send(genre);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const genreSearch = await Genres.findById(req.params.id);
  if (!genreSearch) {
    return res
      .status(404)
      .send(`Cannot find genres with given id : ${req.params.id}`);
  }
  const genre = await Genres.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );
  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const genreSearch = await Genres.findById(req.params.id);
  if (!genreSearch) {
    return res
      .status(404)
      .send(`Cannot find genres with given id : ${req.params.id}`);
  }
  const genre = await Genres.deleteOne({ _id: req.params.id });
  if (!genre) {
    res.status(404).send(`Cannot find genres with id : ${req.params.id}`);
  }
  res.send(genre);
});

module.exports = router;
