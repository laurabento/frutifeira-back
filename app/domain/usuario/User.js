const mongoose = require('mongoose');
const User = mongoose.model('user', { 
  name: String, 
  cpf: String, 
  email: String, 
  password: String,
  phone: String,
  card: String,
  condoId: String
});

module.exports = User;