const mongoose = require('mongoose');
const Product = mongoose.model('product', {
  name: String, 
  description: String, 
  img: String, 
  price: Number, 
  type: String, 
  stand: String
})
  
module.exports = Product;