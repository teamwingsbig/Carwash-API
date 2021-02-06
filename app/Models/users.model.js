const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    username :{
        type:String,        
    },
    password : {
        type:String
    },
    passcode : {
        type:String
    },
    isadmin : {
        type:Boolean
    }

})

module.exports = mongoose.model('User',userSchema)