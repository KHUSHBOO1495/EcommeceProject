const express = require('express');
const ReturnProduct = require('../model/ReturnProduct');
const router = express.Router();

//GET all return details
router.get('/', async(req,res)=>{
    const data = await ReturnProduct.find();
    res.send(data);
})

//GET return detail by id
router.get('/:id', async(req,res)=>{
    const data = await ReturnProduct.findById(req.params.id);
    res.send(data);
})

//POST return detail
router.post('/', async(req,res)=>{
    const data = await User.create(req.body);
    res.send(data);
})

//PATCH(update) return detail
router.patch('/:id', async(req,res)=>{
    const data = await ReturnProduct.findByIdAndUpdate(req.params.id,req.body);
    res.send(data);
})

//DELETE return detail
router.delete('/:id', async(req,res)=>{
    const data = await ReturnProduct.findByIdAndDelete(req.params.id);
    res.send(data);
})

module.exports = router;