const mongoose = require('mongoose');

const returnProduct = mongoose.Schema({
    returnProduct_id: Number,
    order_id: Number,
    return_status: String,
    return_reason: String,
    return_date: Date,
    processed_date: Date,
    return_amount: Number
})

module.exports = mongoose.model("ReturnProduct",returnProduct);