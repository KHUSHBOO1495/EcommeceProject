const express = require("express");
const Order = require("../model/Order");
const User = require("../model/User");
const Cart = require("../model/Cart");
const router = express.Router();

//GET all order
router.get("/", async (req, res) => {
    const data = await Order.find();
    res.send(data);
});

//GET order by id
router.get("/:id", async (req, res) => {
    const data = await Order.findById(req.params.id);
    res.send(data);
});

//POST(create) order

//GET orders of specific user

//PUT(update) order status

//POST(apply) discount to order

//PATCH(update) order
router.patch("/:id", async (req, res) => {
    const data = await Order.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
});

//DELETE order
router.delete("/:id", async (req, res) => {
    const data = await Order.findByIdAndDelete(req.params.id);
    res.send(data);
});

module.exports = router;
