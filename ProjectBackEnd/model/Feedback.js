const mongoose = require('mongoose');

const feedback = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true },
    comment: String,
    commented_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Feedback",feedback);