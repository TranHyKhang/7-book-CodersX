const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

module.exports = Product = mongoose.model("product", productSchema, 'products');