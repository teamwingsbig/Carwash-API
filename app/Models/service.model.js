const mongoose = require('mongoose');
var schema = mongoose.Schema;


const staffSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, default: ''},
    type: {type: String, required: true},
    brand: [{
        brand_id: {type: mongoose.Types.ObjectId, ref: 'brand_master'}, // FK
        varients: [{ 
                           
                name: {type: String},   
                price : {type:Number}            
            }
        ],
    }],
    charge : {type:Number, required:true},
    tax     : { type:Number, required:true },
    status: {type: Boolean, default: true},

}, {
    timestamps: true
});


module.exports = mongoose.model('service_master', staffSchema);
