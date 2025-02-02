const mongoose = require('mongoose');

const order = mongoose.Schema({
    order_id: Number,
    order_status: String,
    total_amount: Number,
    shipping_address: String,
    placed_at: Date,
    updated_at: Date,
    order_items: [{
        quantity: Number,
        product_id: Number,
        price: Number,
    }],
    payment_id: Number
});

module.exports = mongoose.model("Order", order);