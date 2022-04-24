const mongoose = require('mongoose');
const MarketVendor = mongoose.model('marketvendor', { 
  name: String, 
  product_type: String, 
  email: String, 
  password: String
});

module.exports = MarketVendor;