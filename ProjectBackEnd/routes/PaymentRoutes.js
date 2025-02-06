const express = require("express");
const Payment = require("../model/Payment");
const router = express.Router();

//GET all payment
router.get("/", async (req, res) => {
    const data = await Payment.find();
    res.send(data);
});

//GET payment by id
router.get("/:id", async (req, res) => {
    const data = await Payment.findById(req.params.id);
    res.send(data);
});

//POST payment

//PATCH(update) payment
router.patch("/:id", async (req, res) => {
    const data = await Payment.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
});

//DELETE payment
router.delete("/:id", async (req, res) => {
    const data = await Payment.findByIdAndDelete(req.params.id);
    res.send(data);
});

module.exports = router;
