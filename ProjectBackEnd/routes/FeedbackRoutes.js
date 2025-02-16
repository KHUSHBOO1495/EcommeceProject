const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { getAllFeedback, getAllFeedbackOfProduct, createFeedback, getFeedbackById, updateFeedback, deleteFeedback } = require('../controller/feedbackController');
const router = express.Router();

//GET all feedback
router.get('/', authenticate, authorize("getAllFeedback"), getAllFeedback)

//GET all feedback for specific product
router.get('/product/:productId', authenticate, authorize("getAllFeedbackOfProduct"), getAllFeedbackOfProduct)

//GET feedback by id
router.get('/:id', authenticate, authorize("getAllFeedbackOfProduct"), getFeedbackById);

//POST(create) new feedback
router.post('/product/:productId', authenticate, authorize("getAllFeedbackOfProduct"), createFeedback);

//PATCH(update) feedback
router.patch('/:id', authenticate, authorize("getAllFeedbackOfProduct"), updateFeedback)

//DELETE feedback
router.delete('/:id', authenticate, authorize("getAllFeedbackOfProduct"), deleteFeedback)

module.exports = router;