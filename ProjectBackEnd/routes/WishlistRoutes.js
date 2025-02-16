const express = require('express');
const { getAllWishlist, getWishlistById, getProductFromWishlist, updateWishlistProduct, deleteProductFromWishlist, insertProductInWishlist } = require('../controller/wishlistController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

//GET all wishlist
router.get('/', authenticate, authorize('getAllWishlist'),getAllWishlist)

//GET product from user's wishlist
router.get('/products', authenticate, authorize('getProductFromWishlist'), getProductFromWishlist)

//GET wishlist by id
router.get('/:id', authenticate,authorize('getWishlistById'), getWishlistById)

//PATCH(update) wishlist
router.patch('/:id',  authenticate, authorize('updateWishlistProduct'), updateWishlistProduct)

//DELETE product from wishlist
router.delete('/:id', authenticate, authorize('deleteProductFromWishlist'), deleteProductFromWishlist)

//POST(insert) product inside user's wishlist
router.post('/', authenticate, authorize('insertProductInWishlist'), insertProductInWishlist)

module.exports = router;