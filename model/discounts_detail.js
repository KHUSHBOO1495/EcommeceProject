const mongoose = require('mongoose');

const discount = mongoose.Schema({
    discount_id: Number,
    discount_code: String,
    discount_type: String,
    discount_value: Number,
    start_date: Date,
    end_date: Date
})

module.exports = mongoose.model("Discount",discount);