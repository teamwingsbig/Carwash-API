const mongoose = require('mongoose')

const customerOrder = mongoose.Schema({

    customer_name: {type: String},
    customer_id: {type: String},
    customer_contact: {type: String},
    customer_email: {type: String},
    customer_trn: {type: String},
    vehicle_name: {type: String,},
    vehicle_number: {type: String, required: true},
    vehicle_brand: {type: mongoose.Types.ObjectId,ref:"vehicleBrand", required: true,},
    order_date: {type: Date, default: Date.now},
    order_status: {type: Boolean, default: true},
    service: [{
        service_id: {type: mongoose.Types.ObjectId, ref: "service_master"},
        brand_id: {type: mongoose.Types.ObjectId, ref: "brand_master"},
        varient: {type: mongoose.Types.ObjectId, ref: "service_master.brand.varients"},
        varient_name: {type: String},
        price: {type: Number, required: true},
        qty: {type: Number, required: true},
        tax_amount: {type: Number, required: true},
        total_price: {type: Number, required: true}
    }],
    wash_service: [{
        service_id: {type: mongoose.Types.ObjectId, ref: "service_master"},
        price: {type: Number, required: true},
        qty: {type: Number, required: true},
        tax_amount: {type: Number, required: true},
        total_price: {type: Number, required: true}
    }],
    invoice_number: {type: String, required: true},
    invoice_ref_number: {type: String, required: true},
    type: {type: String, required: true},
    service_rep: {type: mongoose.Types.ObjectId, ref: 'service_rep'},
    payment: {
        payment_mode: {type: String, required: true},
        payment_date: {type: Date, required: true},
        subtotal: {type: Number, required: true},
        discount: {type: Number, required: true},
        taxable_amount: {type: Number, required: true},
        vat_total: {type: Number, required: true},
        net_total: {type: Number, required: true},
        payment_status: {type: Boolean, default: true}
    }

})
module.exports = mongoose.model('customer_order', customerOrder)
