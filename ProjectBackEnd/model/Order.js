const mongoose = require('mongoose');

const order = mongoose.Schema({
    order_status: { type: String, required: true, default: "Pending"  },
    total_amount: { type: Number, required: true },
    shipping_address: { type: String, required: true },
    placed_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    order_items: [{
        quantity: { type: Number, required: true },
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }],
    is_deleted: { type: Boolean, default: false },
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coupon_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon', default: null },
});

module.exports = mongoose.model("Order", order);