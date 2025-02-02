const mongoose = require('mongoose');

const category = mongoose.Schema({
    category_id: Number,
    category_name: String,
    description: String,
    image_url: String,
})

module.exports = mongoose.model("Category",category);