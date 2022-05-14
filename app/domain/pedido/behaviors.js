const { Order } = require('./Order');

const updateTotalPrice = ({ Order, totalPrice }) => {
  if (totalPrice <= 0) {
    throw new Error('Preço não pode ser 0 ou negativo'); 
  }
  return Order({
    ...Order,
    totalPrice,
  });
}

module.exports = {
  updateTotalPrice, 
} 