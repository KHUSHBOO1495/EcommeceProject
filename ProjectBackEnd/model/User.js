const mongoose = require('mongoose');

const user = mongoose.Schema({
    // username: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: String,
    address: String,
    profile_picture: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isActive: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    wishlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist', default: null },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', default: null }
})

module.exports = mongoose.model("User", user);