const mongoose = require("mongoose");
const Condominium = mongoose.model("condominium", {
  name: String,
  email: String,
  password: String,
  address: String,
  cep: String,
  city: String,
  state: String,
  contact: String,
  neighborhood: String,
  number: String,
  schedule: String,
  weekDay: String,
});

module.exports = Condominium;
