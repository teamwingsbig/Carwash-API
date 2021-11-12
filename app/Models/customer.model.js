const mongoose = require('mongoose');
var schema = mongoose.Schema;


const customerSchema  = mongoose.Schema({
    name:{ type:String, required:true},
    mobile:{ type:String, required:false},
    address:{type:String, required:false}
   
});

module.exports = mongoose.model('customer_master',customerSchema); 