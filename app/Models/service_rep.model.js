const mongoose = require('mongoose')

const serviceRep = mongoose.Schema({

    name:{
        type:String, 
        required:true
    },
    mobile :{
        type:String, 
        required:true 
    },
    email:{
        type:String,
        require:true
    },
    passcode:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model('service_rep',serviceRep); 