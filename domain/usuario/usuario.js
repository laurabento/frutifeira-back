const User = ({ name, email, password, cpf, phone, card, condoId }) => Object.freeze({
    name, 
    email, 
    password, 
    cpf, 
    phone, 
    card, 
    condoId
});

module.exports = {
	User,
}