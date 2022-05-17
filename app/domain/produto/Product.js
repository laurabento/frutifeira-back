const mongoose = require('mongoose');
const Product = mongoose.model('product', {
  name: String, 
  description: String, 
  img: String, 
  price: Number, 
  discount: Number,
  originalDiscount: Number,
  oldPrice: Number,
  quantity: Number,
  type: String, 
  unit: String, 
  stand: String
})
  
module.exports = Product;