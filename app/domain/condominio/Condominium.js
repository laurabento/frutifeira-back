const mongoose = require('mongoose');
const Condominium = mongoose.model('condominium', { 
  name: String, 
  email: String, 
  password: String, 
  address: String, 
  city: String,  
  state: String, 
  contact: String 
});

module.exports = Condominium;