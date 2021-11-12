const mongoose = require('mongoose');
var schema = mongoose.Schema;


const customerSchema  = mongoose.Schema({
    name:{ type:String, required:true},
    mobile:{ type:String, required:true},
    address:{type:String, required:true}
   
});

module.exports = mongoose.model('customer_master',customerSchema); 