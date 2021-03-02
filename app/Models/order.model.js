const mongoose = require('mongoose')

const customerOrder = mongoose.Schema({

    customer_name :{type:String, required:true},
    customer_contact :{ type: String, required:true},
    customer_email :{ type: String},
    customer_trn :{ type:String},
    vehicle_name :{ type:String,},
    vehicle_number :{ type:String, required:true},
    order_date : {type:Date, default:Date.now},
    service:[{
            service_id:{type:mongoose.Types.ObjectId, ref:"service_master"},        
            brand_id: {type:mongoose.Types.ObjectId, ref:"service_master.brand"},
            varient : {type:mongoose.Types.ObjectId, ref:"service_master.brand.varient"},
            qty: {type:Number, required:true}
       
    }],
    wash_service:[{
        service_id:{type:mongoose.Types.ObjectId, ref:"service_master"},
        qty: {type:Number, required:true}
    }
    ], 
    invoice_number :{ type:String, required:true},
    invoice_ref_number:{ type:String, required:true},
    type:{type:String,required:true},
    service_rep:{ type:mongoose.Types.ObjectId, ref:'service_rep'},
    payment : {
        payment_mode : {type:String, required:true},
        payment_date : {type:Date , required:true},
        subtotal : {type:Number, required:true},
        discount : { type:Number, required:true},
        taxable_amount : { type:Number, required:true},
        vat_total: { type:Number, required:true},
        net_total: {type:Number, required:true},
        payment_status :{ type:Boolean, default:true}
    }

})
module.exports  = mongoose.model('customer_order',customerOrder)