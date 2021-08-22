const express = require("express");
const router = express.Router();
const { Rentals } = require("../models/rentals");
const { Movies } = require("../models/movies");
const auth = require("../middleware/auth");
const Joi = require("joi");
const validate = require("../middleware/validate");

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rentals.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("No rental found");

  if (rental.dateReturned) {
    return res.status(400).send("already processed");
  }
  rental.return();

  await rental.save;

  await Movies.update(
    { _id: rental.movie._id },
    {
      $inc: { numberInStock: 1 },
    }
  );

  res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
