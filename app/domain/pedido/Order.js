const mongoose = require('mongoose');
const Order = mongoose.model('order', { 
  userId: String, 
  totalPrice: Number, 
  qrcode: String, 
  payment: String, 
  cardNumber: String, 
  cardName: String, 
  cardExpirationDate: String, 
  cardSecurityCode: String, 
  scheduling: Date,
  items: [
    {
      productId: String,
      unitprice: Number,
      amount: Number
    }
  ] 
});

module.exports = Order;
