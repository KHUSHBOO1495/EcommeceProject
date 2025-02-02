const mongoose = require('mongoose');

const payment = mongoose.Schema({
    payment_id: Number,
    payment_method: String,
    payment_status: String,
    amount: Number,
    payment_date: Date
})

module.exports = mongoose.model("Payment",payment);