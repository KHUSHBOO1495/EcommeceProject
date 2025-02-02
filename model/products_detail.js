const mongoose = require('mongoose');

const product = mongoose.Schema({
    product_id: Number,
    Product_name: String,
    description: String,
    product_price: Number,
    product_stock: Number,
    image_url: String,
    created_at: Date,
    updated_at: Date,
    category_id: Number,
    discount_id: Number
})

module.exports = mongoose.model("Product",product);