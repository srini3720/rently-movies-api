const express = require("express");
const router = express.Router();
const Joi = require("joi");

const genres = [
  {
    id: 1,
    name: "Romance",
  },
  {
    id: 2,
    name: "Comedy",
  },
  {
    id: 3,
    name: "Action",
  },
  {
    id: 4,
    name: "Thriller",
  },
];

router.get("/", (req, res) => {
  res.send(genres);
});

router.get("/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  if (!genre)
    return res
      .status(404)
      .send(`Cannot find genres with given id : ${req.params.id}`);
  res.send(genre);
});

router.post("/", (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };
  genres.push(genre);
  res.send(genre);
});

router.put("/:id", (req, res) => {
  const { error } = validateGenres(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = genres.find((c) => c.id === parseInt(req.params.id));
  genre.name = req.body.name;
  res.send(genre);
});

router.delete("/:id", (req, res) => {
  const index = parseInt(req.params.id);
  const genre = genres.find((c) => c.id === index);
  if (genre) {
    genres.splice(index - 1, 1);
    res.send(genres);
  } else {
    res
      .status(400)
      .send(`Cannot find genres with id : ${parseInt(req.params.id)}`);
  }
});

function validateGenres(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };
  return Joi.validate(genre, schema);
}

module.exports = router;
