const mongoose = require('mongoose');
const Order = mongoose.model('order', { 
  userId: String, 
  totalPrice: Number, 
  scheduling: {
    schedule: String,
    weekDay: String
  },
  payment: {
    cardCPF: String, 
    cardDate: String, 
    cardName: String, 
    cardNumber: String, 
    cardSecrectyNumber: String, 
    typeCredit: String, 
  },
  items: [
    {
      products: [
        {
          id: String,
          name: String,
          price: String,
          stand_name: String,
          amount: Number
        }
      ],      
      stand_name: String,
      total: Number
    }
  ] 
});

module.exports = Order;
