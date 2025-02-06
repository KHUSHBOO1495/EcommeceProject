const mongoose = require('mongoose');

const cart = mongoose.Schema({
    cart_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    products: [{
        quantity: { type: Number, required: true },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }],
    quantity: { type: Number, required: true },
    added_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cart",cart);