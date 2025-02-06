const express = require('express');
const Wishlist = require('../model/Wishlist');
const router = express.Router();

//GET all cart
router.get('/', async(req,res)=>{
    const data = await Wishlist.find();
    res.send(data);
})
    
//GET cart by id
router.get('/:id', async(req,res)=>{
    const data = await Wishlist.findById(req.params.id);
    res.send(data);
})
    
//GET product from user's wishlist

//GET specific product from wishlist

//POST(insert) product inside user's wishlist

//DELETE product from wishlist

//PATCH(update) wishlist
router.patch('/:id', async(req,res)=>{
    const data = await Wishlist.findByIdAndUpdate(req.params.id,req.body);
    res.send(data);
})

//DELETE wishlist
router.delete('/:id', async(req,res)=>{
    const data = await Wishlist.findByIdAndDelete(req.params.id);
    res.send(data);
})

module.exports = router;