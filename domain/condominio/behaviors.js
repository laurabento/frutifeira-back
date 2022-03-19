const { Condominium } = require('./condominio'); 

const updateName = ({ Condominium, name }) => {
  if (typeof name !== typeof '') {
    throw new Error('Nome não pode ser vazio'); 
  }
  return Condominium({
    ...Condominium,
    name,
  });
}

module.exports = {
  updateName, 
} 