const { Usuario } = require('./usuario'); 

const updateName = ({ Usuario, name }) => {
if (typeof name !== typeof '') {
	throw new Error('Nome não pode ser vazio'); 
}
  return Usuario({
    ...Usuario,
    name,
  });
}

module.exports = {
    updateName, 
} 