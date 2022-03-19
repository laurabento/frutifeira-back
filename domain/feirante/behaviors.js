const { MarketVendor } = require('./feirante'); 

const updateName = ({ MarketVendor, name }) => {
  if (typeof name !== typeof '') {
    throw new Error('Nome não pode ser vazio'); 
  }
  return MarketVendor({
    ...MarketVendor,
    name,
  });
}

module.exports = {
  updateTotalPrice, 
} 