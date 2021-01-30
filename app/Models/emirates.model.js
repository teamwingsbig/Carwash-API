const mongoose = require('mongoose')

const numberplateEmirate = mongoose.Schema({
    emirate_name : {type:String, required:true},
    category: [{
        emirate_category : {type:String}
    }],
    status:{type:Boolean, default:true}
});

module.exports  = mongoose.model('NumberPlate_EmirateCategory',numberplateEmirate)