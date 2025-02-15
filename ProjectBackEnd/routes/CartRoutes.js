const express = require('express');
const Cart = require('../model/Cart');
const User = require('../model/User');
const authMiddleware = require('../middleware/authMiddleware');
const { getAllCart, getCartById, getProductFromCart, updateCartProduct, deleteProductFromCart, insertProductInCart } = require('../controller/cartController');
const router = express.Router();

//GET all cart
router.get('/', authMiddleware.authenticate, getAllCart)

//GET product from user's cart
router.get('/products', authMiddleware.authenticate, getProductFromCart)

//GET cart by id
router.get('/:id', authMiddleware.authenticate, getCartById)

//PATCH(update) cart
router.patch('/:id',  authMiddleware.authenticate, updateCartProduct)

//DELETE product from cart
router.delete('/:id', authMiddleware.authenticate, deleteProductFromCart)

//GET specific product from cart

//POST(insert) product inside user's cart
router.post('/', authMiddleware.authenticate, insertProductInCart)

module.exports = router;