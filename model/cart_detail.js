const mongoose = require('mongoose');

const cart = mongoose.Schema({
    cart_id: Number,
    product_id: Number,
    quantity: Number,
    added_at: Date,
    updated_at:Date,
})

module.exports = mongoose.model("Cart",cart);