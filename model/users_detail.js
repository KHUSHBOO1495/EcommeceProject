const mongoose = require('mongoose');

const user = mongoose.Schema({
    user_id: Number,
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    phone_number: String,
    address: String,
    created_at: Date,
    updated_at: Date,
    wishlist_id: Number,
    cart_id: Number,
})

module.exports = mongoose.model("User",user);