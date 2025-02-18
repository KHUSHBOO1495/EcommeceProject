const express = require('express');
const { getAllCoupon, getAllActiveCoupon, createCoupon, updateCoupon, deleteCoupon } = require('../controller/couponController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

//GET all coupons
router.get('/', authenticate, authorize("getAllCoupon"), getAllCoupon)

//GET all active coupons
router.get('/active', authenticate, authorize("getAllActiveCoupon"), getAllActiveCoupon)

//POST(create) coupon (admin)
router.post('/', authenticate, authorize("createCoupon"), createCoupon)

//PATCH(update) coupon details (admin)
router.patch('/:id', authenticate, authorize("updateCoupon"), updateCoupon)

// DELETE coupon
router.delete('/:id', authenticate, authorize("deleteCoupon"), deleteCoupon)

module.exports = router;