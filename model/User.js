const mongoose = require('mongoose');

const user = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone_number: String,
    address: String,
    role: { type: String, enum: ['customer','admin'], default:'customer'},
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    wishlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Wishlist', required: true },
    cart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
})

module.exports = mongoose.model("User",user);