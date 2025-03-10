const mongoose = require('mongoose');

const wishlist = mongoose.Schema({
    products: [{
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    }],
    added_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Wishlist", wishlist);