const mongoose = require('mongoose');
const Stand = mongoose.model('stand', { 
  scheduleHour: Date, 
  feiranteId: String, 
  condominioId: String
});

module.exports = Stand;
