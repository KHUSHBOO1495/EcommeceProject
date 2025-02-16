const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getAllDiscount, getDiscountById, getAllActiveDiscount, createDiscount, updateDiscount, deleteDiscount } = require('../controller/discountController');
const router = express.Router();

//GET all discount
router.get('/', authenticate, authorize("getAllDiscount"), getAllDiscount)

//GET all active discounts
router.get('/active', authenticate, authorize("getAllActiveDiscount"), getAllActiveDiscount)

//GET discount details by id
router.get('/:id', authenticate, authorize("getDiscountById"), getDiscountById)

//POST(create) discount (admin)
router.post('/', authenticate, authorize("createDiscount"), createDiscount)

//PATCH(update) discount details (admin)
router.patch('/:id', authenticate, authorize("updateDiscount"), updateDiscount)

//DELETE discount
router.delete('/:id', authenticate, authorize("deleteDiscount"), deleteDiscount)

module.exports = router;