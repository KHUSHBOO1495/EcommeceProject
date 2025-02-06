const express = require('express');
const Discount = require('../model/Discount');
const router = express.Router();

//GET all discount
router.get('/', async (req, res) => {
    const data = await Discount.find();
    res.send(data);
})

//GET all active discounts

//GET discount details by id
router.get('/:id', async (req, res) => {
    const data = await Discount.findById(req.params.id);
    res.send(data);
})

//POST(create) discount (admin)
router.post('/', async (req, res) => {
    const data = await User.create(req.body);
    res.send(data);
})

//PATCH(update) discount details (admin)
router.patch('/:id', async (req, res) => {
    const data = await Discount.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
})

//DELETE discount
router.delete('/:id', async (req, res) => {
    const data = await Discount.findByIdAndDelete(req.params.id);
    res.send(data);
})

module.exports = router;