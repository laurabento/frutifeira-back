const mongoose = require('mongoose');
const MarketVendor = mongoose.model('marketvendor', {
    name: String,
    product_type: [{
        type: String
    }],
    stand_name: String,
    email: String,
    password: String
});

module.exports = MarketVendor;