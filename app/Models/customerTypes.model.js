const mongoose = require('mongoose');
const schema = mongoose.Schema;


const customerTypeSchema  = mongoose.Schema({
    name:{ type:String, required:true},
    status: {type: Boolean, default: true},

});

module.exports = mongoose.model('customerTypes',customerTypeSchema);
