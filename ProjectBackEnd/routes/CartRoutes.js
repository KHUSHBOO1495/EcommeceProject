const express = require('express');
const {authenticate} = require('../middleware/authMiddleware');
const { getAllCart, getCartById, getProductFromCart, updateCartProduct, deleteProductFromCart, insertProductInCart } = require('../controller/cartController');
const router = express.Router();

//GET all cart
router.get('/', authenticate, getAllCart)

//GET product from user's cart
router.get('/products', authenticate, getProductFromCart)

//GET cart by id
router.get('/:id', authenticate, getCartById)

//PATCH(update) cart
router.patch('/:id',  authenticate, updateCartProduct)

//DELETE product from cart
router.delete('/:id', authenticate, deleteProductFromCart)

//GET specific product from cart

//POST(insert) product inside user's cart
router.post('/', authenticate, insertProductInCart)

module.exports = router;