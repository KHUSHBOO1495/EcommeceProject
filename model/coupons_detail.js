const mongoose = require('mongoose');

const coupon = mongoose.Schema({
    coupon_id: Number,
    coupon_code: String,
    discount_type: String,
    discount_value:Number,
    valid_from: Date,
    valid_to: Date,
    usage_limit: Number,
})

module.exports = mongoose.model("Coupon",coupon);