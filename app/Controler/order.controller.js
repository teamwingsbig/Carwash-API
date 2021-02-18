const Order = require('../Models/order.model')
const Response = require('../helper/response')
const emailValidator = require('email-validator')

exports.createOrder = (req, res) => {
    
    try {

        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/
        const NumPlateRegEx = /^[A-Z]{3}-\d{5}-[A-Z]{1}$/
       
        const sub_serviceArray = []
        let serviceDetails = {}
        

        const service = req.body.service
        const payment = req.body.payment
        const sub_services = service.sub_service
        service_id = service.service_id

        if(!sub_services) {
             serviceDetails = {
                service_id:service_id,
            }  
        }

        else {
            for(const subservice of sub_services) {
                const sub_service_id = subservice.sub_service_id
                const varient = subservice.varient
                   sub_serviceArray.push({
                       sub_service_id :sub_service_id,
                       varient:varient
                   }) 
               } 
              
                serviceDetails = {
                   service_id:service_id,
                   sub_service : sub_serviceArray
                 
        }

        //looping Through service object
  sub_service:sub_serviceArray
           }  
            const paymentDetails ={
                payment_mode:payment.payment_mode,
                payment_date:payment.payment_date,
                subtotal:payment.subtotal,
                discount:payment.discount,
                taxable_amount:payment.taxable_amount,
                vat_total:payment.vat_total,
                net_total:payment.net_total,              

            }
       
        
       

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
            service:serviceDetails,
            invoice_number:invoice_number,
            invoice_ref_number:invoice_ref_number,
            service_rep:service_rep,
            payment:paymentDetails
        })
        // res.send(order)

        order.save().then((data) => {
            return Response.sendSuccessmsg(res,'Order Created')
        })
        .catch(err => {
            return Response.sendFailedmsg(res,'Failed To Create Order!',err.message)
        })
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




