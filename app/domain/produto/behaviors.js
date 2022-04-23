const { Product } = require('./produto'); 

const updateName = ({ Product, name }) => {
  if (typeof name !== typeof '') {
    throw new Error('Nome não pode ser vazio'); 
  }
  return Product({
    ...Product,
    name,
  });
}

module.exports = {
    updateName, 
} 