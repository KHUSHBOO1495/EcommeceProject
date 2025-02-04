const mongoose = require('mongoose');

const discount = mongoose.Schema({
    discount_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    discount_type: { type: String, required: true },
    discount_value: { type: Number, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
})

module.exports = mongoose.model("Discount",discount);