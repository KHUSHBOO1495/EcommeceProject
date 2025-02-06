const express = require("express");
const Product = require("../model/Product");
const router = express.Router();

//GET all products
router.get("/", async (req, res) => {
    const data = await Product.find();
    res.send(data);
});

//GET product by id
router.get("/:id", async (req, res) => {
    const data = await Product.findById(req.params.id);
    res.send(data);
});

//POST product
router.post("/", async (req, res) => {
    const data = await Product.create(req.body);
    res.send(data);
});

//PATCH(update) product
router.patch("/:id", async (req, res) => {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
});

//DELETE product
router.delete("/:id", async (req, res) => {
    const data = await Product.findByIdAndDelete(req.params.id);
    res.send(data);
});

module.exports = router;
