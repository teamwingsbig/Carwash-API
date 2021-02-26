const Order = require('../Models/order.model')
const Response = require('../helper/response')
const emailValidator = require('email-validator')

exports.createOrder = (req, res) => {
    
    try {

        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/
        const NumPlateRegEx = /^[A-Z]{3}-\d{5}-[A-Z]{1}$/
       
        const serviceArray = []
        const washserviceArray = []
        

        const service = req.body.service
        const wash_service = req.body.wash_service
        const payment = req.body.payment

       if(service) {
           for (services of service) {
               service_id = services.service_id,
               brand_id = services.brand_id,
               varient = services.varient
           }

           serviceArray.push ({
               service_id : services.service_id,
               brand_id : services.brand_id,
               varient : services.varient
           })
       }

       if(wash_service) {
           for(wash_services of wash_service) {
               service_id = wash_services.service_id
           }
           washserviceArray.push({
               service_id:service_id
           })
       }
        

            const taxable_amount = parseFloat(payment.subtotal) - parseFloat(payment.discount)
            const vat_total      = parseFloat(payment.vat_total)
            const net_total      = taxable_amount + vat_total

            const paymentDetails ={
                payment_mode:payment.payment_mode,
                payment_date:payment.payment_date,
                subtotal:payment.subtotal,
                discount:payment.discount,
                taxable_amount:taxable_amount,
                vat_total:vat_total,
                net_total:net_total,            

            }    

                res.send(paymentDetails)
        
       

        const {
            customer_name,
            customer_contact,
            customer_email,
            customer_trn,
            vehicle_name,
            vehicle_number,                      
            invoice_number,
            invoice_ref_number,
            service_rep
        } = req.body

        if(!customer_name || !customer_contact || !customer_email || !vehicle_number || !vehicle_name || !invoice_number || !invoice_ref_number || !service_rep) {
            return Response.sendFailedmsg(res,'Please Fill All Fields')
        }

        if(customer_name.match(AlphaRegEx) == null ) {
            return Response.sendFailedmsg(res,'Name Should Be Alphabetic') 
        }

        if(!emailValidator.validate(customer_email)) {
            return Response.sendFailedmsg(res,'Name Should Be Alphabetic')            
        }

        if(vehicle_number.match(NumPlateRegEx) == null) {
            return Response.sendFailedmsg(res,'Invalid Vehicle Number')  
        }    
     


        const order = new Order({
            customer_name:customer_name,
            customer_contact:customer_contact,
            customer_email:customer_email,
            customer_trn:customer_trn,
            vehicle_name:vehicle_name,
            vehicle_number:vehicle_number,
            service:serviceArray,
            wash_service:washserviceArray,
            invoice_number:invoice_number,
            invoice_ref_number:invoice_ref_number,
            service_rep:service_rep,
            payment:paymentDetails
        })

        // order.save().then((data) => {
        //     return Response.sendSuccessmsg(res,'Order Created')
        // })
        // .catch(err => {
        //     return Response.sendFailedmsg(res,'Failed To Create Order!',err.message)
        // })
    }

    catch(err) {
        return Response.sendFailedmsg(res,'Failed To Create Order!',err.message)
    }
}

exports.getOrders = (req, res) => {
    try{

        Order.find().then((data) => {
            res.send(data)
        })
        .catch(err => {
            res.send([])
        })
    }

    catch(err) {
        res.send([])
    }
} 


exports.getSingleOrder = (req,res) => {
    try {

        Order.findById(req.params.id).then((data) => {
            res.send(data)
        })
        .catch(err =>{
            res.send([])
        })
    }
    catch(err) {
        res.send([])
    }
}


exports.orderReport = (req,res) => {
    try {

      const { start_date, end_date, service_rep } = req.body
      const { limit=10, page=1} = req.query

      const startDate = new Date(start_date)
      const endDate   = new Date(end_date)

      if(start_date && end_date) {
          Order.find({order_date:{$gt:startDate,$lt:endDate}})
          .limit(limit * 1)
          .skip((page-1)*limit)
          .then((data) => {
              res.send(data)
          })
          .catch(err => {
              res.send([])
          })

    }

      else if(start_date) {
          Order.find({order_date:{$gt:startDate}})
          .limit(limit * 1)
          .skip((page-1)*limit)
          .then((data) => {
              res.send(data)
          })
          .catch(err => {
            res.send([])
        })
    }

      else if(end_date) {
        Order.find({order_date:{$lt:endDate}})
        .limit(limit * 1)
        .skip((page-1)*limit)
        .then((data) => {
            res.send(data)
        })
        .catch(err => {
            res.send([])
        })
    }
     
     else if(service_rep) {
        Order.find({service_rep:service_rep})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .then((data) => {
            res.send(data)
        })
        .catch(err => {
            res.send([])
        })
    }

    // else if(start_date && end_date && service_rep) {
    //     Order.find({order_date:{$gt:startDate,$lt:endDate},service_rep:service_rep})
    //     .limit(limit * 1)
    //     .skip((page-1)*limit)
    //     .then((data) => {
    //         res.send(data)
    //     })
    //     .catch(err => {
    //         res.send([])
    //     })
    // }



    }
    catch(err) {
        res.send([])
    }
}

// 6019053d9064a928c8bd57b0




