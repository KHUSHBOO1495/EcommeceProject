const express = require('express');
const {authenticate, authorize} = require('../middleware/authMiddleware');
const { getAllCart, getCartById, getProductFromCart, updateCartProduct, deleteProductFromCart, insertProductInCart } = require('../controller/cartController');
const router = express.Router();

//GET all cart
router.get('/', authenticate, authorize('getAllCart'), getAllCart)

//GET product from user's cart
router.get('/products', authenticate, authorize('getProductFromCart'), getProductFromCart)

//GET cart by id
router.get('/:id', authenticate,authorize('getCartById'), getCartById)

//POST(insert) product inside user's cart
router.post('/', authenticate,authorize('insertProductInCart'), insertProductInCart)

//PATCH(update) cart
router.patch('/:id',  authenticate,authorize('updateCartProduct'), updateCartProduct)

//DELETE product from cart
router.delete('/:id', authenticate,authorize('deleteProductFromCart'), deleteProductFromCart)

module.exports = router;