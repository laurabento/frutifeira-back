const Order = ({ userId, totalPrice, qrcode, payment, scheduling, items }) => Object.freeze({
    userId, 
    totalPrice, 
    qrcode, 
    payment, 
    scheduling, 
    items
  });
  
  module.exports = {
    Order,
  }