const express = require('express');
const Coupon = require('../model/Coupon');
const router = express.Router();

//GET all coupons
router.get('/', async (req, res) => {
    const data = await Coupon.find();
    res.send(data);
})

//GET coupon by id
router.get('/:id', async (req, res) => {
    const data = await Coupon.findById(req.params.id);
    res.send(data);
})

//POST(apply) coupon to order

//POST(create) coupon (admin)
router.post('/', async(req,res)=>{
    const data = await Coupon.create(req.body);
    res.send(data);
})

//PATCH(update) coupon details (admin)
router.patch('/:id', async (req, res) => {
    const data = await Coupon.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
})

// DELETE coupon
router.delete('/:id', async (req, res) => {
    const data = await Coupon.findByIdAndDelete(req.params.id);
    res.send(data);
})

module.exports = router;