const { Rentals, validate } = require("../models/rentals");
const { Customer } = require("../models/customers");
const { Movies } = require("../models/movies");
const Fawn = require("fawn");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
Fawn.init(mongoose);

router.get("/", async (req, res) => {
  const rental = await Rentals.find();
  res.send(rental);
});

router.get("/:id", async (req, res) => {
  try {
    const rental = await Rentals.findById(req.params.id);
  } catch {
    return res
      .status(400)
      .send(`cannot find rental with id : ${req.params.id}`);
  }

  res.send(rental);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  try {
    await Customer.findById(req.body.customerId);
  } catch {
    return res.status(400).send(`Invalid customer`);
  }

  try {
    await Movies.findById(req.body.moviesId);
  } catch {
    return res.status(400).send(`Invalid customer`);
  }
  const movie = await Movies.findById(req.body.movieId);
  if (movie.numberInstock === 0) return res.send(`Movies not in stock`);
  const customer = await Customer.findById(req.body.customerId);
  const rental = await new Rentals({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInstock: -1 },
        }
      )
      .run();
    res.send(rental);
  } catch (err) {
    res.status(500).send("Internal server failed ", err);
  }
  //   const savedRental = await rental.save();
  //   movie.numberInstock--;
  //   movie.save();
  //   res.send(savedRental);
});

module.exports = router;
