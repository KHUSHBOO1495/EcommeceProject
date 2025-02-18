const express = require('express');
const { getAllWishlist, getWishlistById, getProductFromWishlist, deleteProductFromWishlist, insertProductInWishlist, itemToggle } = require('../controller/wishlistController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

//GET all wishlist
router.get('/', authenticate, authorize('getAllWishlist'),getAllWishlist)

//GET product from user's wishlist
router.get('/products', authenticate, authorize('getProductFromWishlist'), getProductFromWishlist)

//GET wishlist by id
router.get('/:id', authenticate,authorize('getWishlistById'), getWishlistById)

//POST OR DELETE product in wishlist
router.post('/', authenticate, authorize('itemToggle'), itemToggle)

// //DELETE product from wishlist
// router.delete('/:id', authenticate, authorize('deleteProductFromWishlist'), deleteProductFromWishlist)

//POST(insert) product inside user's wishlist

module.exports = router;