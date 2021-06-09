const mongoose = require('mongoose');


const brandSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId, ref: 'vehicleBrand',
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('vehicle', brandSchema);
