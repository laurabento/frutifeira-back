const Product = ({ name, description, img, price, type, stand }) => Object.freeze({
    name, 
    description, 
    img, 
    price, 
    type, 
    stand
  });
  
  module.exports = {
    Product,
  }