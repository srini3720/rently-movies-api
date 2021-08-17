const { Customer, validate } = require("../models/customers");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

router.get("/", async (req, res) => {
  const customer = await Customer.find();
  res.send(customer);
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
  } catch {
    return res
      .status(404)
      .send(`cannot find customer with given id : ${req.params.id}`);
  }
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  });
  await customer.save();
  res.send(customer);
});

router.put("/:id", auth, async (req, res) => {
  const customer = await Customer.updateOne(
    { _id: req.params.id },
    {
      isGold: req.body.isGold,
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Customer.deleteOne({ _id: req.params.id });
  res.send(customer);
});

module.exports = router;
