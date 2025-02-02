const mongoose = require('mongoose');

const wishlist = mongoose.Schema({
    wishlist_id: Number,
    product_id: Number,
    added_at: Date,
    updated_at:Date,
})

module.exports = mongoose.model("Wishlist",wishlist);