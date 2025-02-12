const mongoose = require('mongoose');

const cart = mongoose.Schema({
    products: [{
        quantity: { type: Number, required: true },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    }],
    quantity: { type: Number, required: true },
    added_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart", cart);