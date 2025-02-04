const mongoose = require('mongoose');

const product = mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    product_name: { type: String, required: true },
    description: String,
    product_price: { type: Number, required: true },
    product_stock: { type: Number, required: true },
    image_url: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    discount_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Discount' },
});

module.exports = mongoose.model("Product",product);