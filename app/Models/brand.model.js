const mongoose = require('mongoose');


const brandSchema  = mongoose.Schema({
    brandName : {
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default: true
    }
});

module.exports = mongoose.model('brand_master',brandSchema); 