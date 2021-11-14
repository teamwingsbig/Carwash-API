const mongoose = require('mongoose');
var schema = mongoose.Schema;


const customerSchema = mongoose.Schema({
    name: {type: String, required: true},
    mobile: {type: String, required: false},
    address: {type: String, required: false},
    trn: {type: String, required: false},
    status: {type: Boolean, default: true},
    customerType: {type: mongoose.Types.ObjectId, ref: "customerTypes"},

});

module.exports = mongoose.model('customer_master', customerSchema);
