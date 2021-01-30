const mongoose = require('mongoose');
var schema = mongoose.Schema;


const companySchema  = mongoose.Schema({
    name:{ type:String, required:true},
    address:{ type:String, required:true},
    arabicName:{ type:String, required:true},
    mobile:{ type:String, require:true},
    landPhone:{ type: String, required:true},
    currency:{ type:String, required:true},
    trn:{ type:String, required:true},
    tax:{ type:Number, require:true},
    vat:{ type:Number, require:true},
    email:{ type:String, required:true},
    logo: { type:String, required:true},
    locationqr:{ type:String, required:true},
    termsandconditions:{type:String, required:true}
});

module.exports = mongoose.model('company_master',companySchema); 