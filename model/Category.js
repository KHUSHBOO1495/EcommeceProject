const mongoose = require('mongoose');

const category = mongoose.Schema({
    category_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    category_name: { type: String, required: true },
    description: String,
    image_url: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Category",category);