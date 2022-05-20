const mongoose = require('mongoose');
const Product = mongoose.model('product', {
  name: String, 
  description: String, 
  img: String, 
  price: Number, 
  discount: Number,
  finalPrice: Number,
  quantity: Number,
  type: String, 
  unit: String, 
  marketVendorId: String, 
  stand: String
})
  
module.exports = Product;