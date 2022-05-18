const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const MarketCondominium = mongoose.model('marketCondominium', {
    condominiumId: String,
    marketVendorId: String
});

module.exports = MarketCondominium;