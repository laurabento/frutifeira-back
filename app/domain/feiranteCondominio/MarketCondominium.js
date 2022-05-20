const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const MarketCondominium = mongoose.model('marketCondominium', {
    condominiumId: String,
    marketVendorId: String,
    status: String,
    approvalDate: String
});

module.exports = MarketCondominium;