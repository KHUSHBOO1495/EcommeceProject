const mongoose = require('mongoose');

const feedback = mongoose.Schema({
    feedback_id: Number,
    user_id: Number,
    product_id: Number,
    ratting: Number,
    comment: String,
    commented_at: Date
})

module.exports = mongoose.model("Feedback",feedback);