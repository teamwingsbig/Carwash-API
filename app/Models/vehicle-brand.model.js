const mongoose = require('mongoose');


const brandSchema  = mongoose.Schema({
    name : {
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default: true
    }
});

module.exports = mongoose.model('vehicleBrand',brandSchema);
