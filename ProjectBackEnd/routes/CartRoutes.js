const express = require('express');
const Cart = require('../model/Cart');
const User = require('../model/User');
const router = express.Router();

//GET all cart
router.get('/', async(req,res)=>{
    const data = await Cart.find();
    res.send(data);
})

//GET cart by id
router.get('/:id', async(req,res)=>{
    const data = await Cart.findById(req.params.id);
    res.send(data);
})

//PATCH(update) cart
router.patch('/:id', async(req,res)=>{
    const data = await Cart.findByIdAndUpdate(req.params.id,req.body);
    res.send(data);
})

//DELETE product from cart
router.delete('/:id', async(req,res)=>{
    const data = await Cart.findByIdAndDelete(req.params.id);
    res.send(data);
})

//GET product from user's cart
app.get("/order", async (req, res) => {
    // const { userId } = { user_id : '67a2173c098b7823437e0d02' }
    // const cart = await Cart.findOne({userId})
    // .populate('products.product_id')
    // .exec()

    // res.send(cart);

    const { user_id } = { user_id: "67a2173c098b7823437e0d02" };
    const user = await User.findOne({ user_id });

    const cart = await Cart.findOne({ cart_id: user.cart_id });
    console.log(cart.products);
    // .populate('products.product_id')
    // .exec()

    // const product = await Product.findOne({product_id: '67a2173b098b7823437e0ce2'})
    // console.log(cart)

    // const cart = await Cart.findOne(user.cart_id).populate('products.product_id')
    // .exec()

    // console.log(user.cart_id);
    // console.log(cart);

    res.send(cart);
});

//GET specific product from cart

//POST(insert) product inside user's cart

module.exports = router;