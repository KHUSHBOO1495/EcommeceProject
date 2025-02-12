const mongoose = require('mongoose');

const coupon = mongoose.Schema({
    coupon_code: { type: String, required: true, unique: true },
    discount_type: { type: String, required: true },
    discount_value: { type: Number, required: true },
    valid_from: { type: Date, required: true },
    valid_to: { type: Date, required: true },
    usage_limit: { type: Number, required: true },
})

module.exports = mongoose.model("Coupon", coupon);