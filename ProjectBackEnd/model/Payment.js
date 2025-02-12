const mongoose = require('mongoose');

const payment = mongoose.Schema({
    payment_method: { type: String, required: true },
    payment_status: String,
    amount: { type: Number, required: true },
    payment_date: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Payment", payment);