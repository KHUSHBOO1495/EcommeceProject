const mongoose = require('mongoose');

const payment = mongoose.Schema({
    payment_method: { type: String, enum: ['COD', 'Razorpay'], required: true },  // Only COD and Razorpay
    payment_status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
    amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now },
    transaction_id: { type: String, default: null },  // Store Transaction ID for COD or Razorpay
    razorpay_payment_id: { type: String, default: null },  // Razorpay Payment ID (for Razorpay)
    razorpay_order_id: { type: String, default: null },  // Razorpay Order ID (for Razorpay)
    razorpay_signature: { type: String, default: null },  // Razorpay Signature (for Razorpay)
    payer_contact: { type: String, default: null },  // Store payer contact number (optional)
    payment_mode: { type: String, default: null },  // Mode of payment for Razorpay, e.g., UPI, Card
});

module.exports = mongoose.model("Payment", payment);