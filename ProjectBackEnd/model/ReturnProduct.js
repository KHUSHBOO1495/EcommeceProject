const mongoose = require('mongoose');

const returnProduct = mongoose.Schema({
    returnProduct_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    return_status: String,
    return_reason: String,
    return_date: { type: Date, default: Date.now },
    processed_date: { type: Date, default: Date.now },
})

module.exports = mongoose.model("ReturnProduct",returnProduct);