const mongoose = require('mongoose');

const payment = mongoose.Schema({
    payment_method: { type: String, enum: ['COD', 'Razorpay'], required: true },  // Only COD and Razorpay
    payment_status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now },
    razorpay_payment_id: { type: String, default: null },  // Razorpay Payment ID (for Razorpay)
    razorpay_order_id: { type: String, default: null },  // Razorpay Order ID (for Razorpay)
});

module.exports = mongoose.model("Payment", payment);