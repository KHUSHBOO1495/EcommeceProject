const Feedback = require("../model/Feedback");
const Product = require("../model/Product");
const User = require("../model/User");

const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find();
        res.status(200).json({ feedbacks });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getAllFeedbackOfProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const feedbacks = await Feedback.find({ product_id: productId });

        if (!feedbacks.length) {
            return res.status(404).json({ message: 'No feedback found for this product' });
        }

        res.status(200).json({ feedbacks });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const getFeedbackById = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id)
            .populate('user_id', 'username')
            .populate('product_id', 'product_name');

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        res.status(200).json({ feedback });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const createFeedback = async (req, res) => {
    try {
        const { productId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user.user_id;

        // Validate input fields
        if (!userId || !rating) {
            return res.status(400).json({ message: 'User ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists
        const productExists = await Product.findById(productId);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newFeedback = new Feedback({
            user_id: userId,
            product_id: productId,
            rating,
            comment,
            commented_at: Date.now()
        });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully', feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const updateFeedback = async (req, res) => {
    try {
        const uId = req.user.user_id;
        if (!uId) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }

        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        if (feedback.user_id.toString() !== uId && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can't update this feedback." });
        }

        // Extract allowed fields from request body
        const { rating, comment } = req.body;
        if (rating === undefined && !comment) {
            return res.status(400).json({ message: "Please provide rating or comment to update." });
        }

        feedback.rating = rating ?? feedback.rating;
        feedback.comment = comment ?? feedback.comment;
        feedback.commented_at = Date.now(); // Update timestamp

        await feedback.save();
        res.status(200).json({ message: "Feedback updated successfully", feedback });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

const deleteFeedback = async (req, res) => {
    try {
        // const { id } = req.params;

        const uId = req.user.user_id;
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        if (feedback.user_id.toString() !== uId) {
            return res.status(403).json({ message: "Access denied. You can't delete this feedback." });
        }

        const deletedFeedback = await Feedback.findByIdAndDelete(req.params.id);
        
        if (!deletedFeedback) {
            return res.status(404).json({ message: 'Feedback not deleted successfully' });
        }

        res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

module.exports = { getAllFeedback, getAllFeedbackOfProduct, createFeedback, getFeedbackById, updateFeedback, deleteFeedback }