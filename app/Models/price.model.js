const mongoose = require('mongoose');


const priceSchema = mongoose.Schema({
    customerType: {
        type: mongoose.Types.ObjectId, ref: 'customerTypes'
        required: true
    },
    service: {
        type: mongoose.Types.ObjectId, ref: 'service_master'
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    serviceType: {
        type: String,
        enum: ["Wash", "Service"],
        default: "Service"
    }
});

module.exports = mongoose.model('price', priceSchema);
