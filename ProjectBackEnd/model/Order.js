const mongoose = require('mongoose');

const order = mongoose.Schema({
    order_status: { type: String, required: true },
    total_amount: { type: Number, required: true },
    shipping_address: { type: String, required: true },
    placed_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    order_items: [{
        quantity: { type: Number, required: true },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }],
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', required: true },
});

module.exports = mongoose.model("Order", order);