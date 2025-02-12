const express = require('express');
const Cart = require('../model/Cart');
const User = require('../model/User');
const router = express.Router();

//GET all cart
router.get('/', async (req, res) => {
    const data = await Cart.find();
    res.send(data);
})

//GET product from user's cart
router.get('/product', async (req, res) => {
    const user_id = "67ab37a1d9a054a5ec2bee15"
    const user = await User.findById(user_id)
    const cart = await Cart.findOne(user.cart_id).populate('products.product_id')
    res.send(cart);
})

//GET cart by id
router.get('/:id', async (req, res) => {
    const data = await Cart.findById(req.params.id);
    res.send(data);
})

//PATCH(update) cart
router.patch('/:id', async (req, res) => {
    const data = await Cart.findByIdAndUpdate(req.params.id, req.body);
    res.send(data);
})

//DELETE product from cart
router.delete('/:id', async (req, res) => {
    const data = await Cart.findByIdAndDelete(req.params.id);
    res.send(data);
})

//POST product inside cart
router.post('/', async (req, res) => {
    const data = await Cart.create(req.body);
    res.send(data);
})

//GET specific product from cart

//POST(insert) product inside user's cart

module.exports = router;