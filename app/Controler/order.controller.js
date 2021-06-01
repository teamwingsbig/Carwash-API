const Order = require('../Models/order.model')
const Response = require('../helper/response')
const emailValidator = require('email-validator')

exports.createOrder = (req, res) => {

    try {


        const serviceArray = []
        const washserviceArray = []

        let service_items
        let wash_service_items


        const service = req.body.service
        const wash_service = req.body.wash_service
        const payment = req.body.payment
        const status = req.body.status == undefined ? JSON.parse('false') : JSON.parse(req.body.status);

        if(service === undefined && wash_service === undefined ) {
            return Response.sendFailedmsg(res,'Please Specify Service Details')
        }


        if(service != undefined && service!= null ) {
            let items = typeof(service) == "string" ? JSON.parse(service) : service
            if (items.length > 0) {
                for (services of items) {
                        serviceArray.push({
                            service_id: services.service_id,
                            brand_id: services.brand_id,
                            varient: services.varient_id,
                            varient_name: services.varient_name,
                            price:services.price,
                            qty:services.qty,
                            tax_amount : services.tax,
                            total_price:services.total
                        })
                }

            }
            else {
                return Response.sendFailedmsg(res,'Please Specify Service Details')
            }
        }

        if (wash_service != undefined && wash_service != null) {
            let items = typeof(wash_service) == "string" ? JSON.parse(wash_service) : wash_service
            if (items.length > 0) {
                for (wash_services of items) {
                    service_id = wash_services.service_id
                    washserviceArray.push({
                        service_id: service_id,
                        price:wash_services.price,
                        qty:wash_services.qty,
                        tax_amount : wash_services.tax,
                        total_price:wash_services.total
                    })
                }

            }
            else {
                return Response.sendFailedmsg(res,'Please Specify Service Details')
            }
        }

        // console.log(washserviceArray)
        const taxable_amount = parseFloat(payment.subtotal) - parseInt(payment.discount)


        const paymentDetails = {
            payment_mode: payment.payment_mode,
            payment_date: payment.payment_date,
            subtotal: payment.subtotal,
            discount: payment.discount,
            taxable_amount: taxable_amount,
            vat_total: payment.vat_total,
            net_total: payment.net_total,
            payment_status: status
        }

        // res.send(paymentDetails)


        const {
            customer_name,
            customer_contact,
            customer_trn,
            vehicle_name,
            vehicle_number,
            invoice_number,
            invoice_ref_number,
            type,
            service_rep
        } = req.body

        if (customer_name == '' || customer_name == undefined) {
            return Response.sendFailedmsg(res, 'Name Is Required')
        }
        if (customer_contact == '' || customer_contact == undefined) {
            return Response.sendFailedmsg(res, 'Contact Is Required')
        }
        if (isNaN(customer_contact)) {
            return Response.sendFailedmsg(res, 'Invalid Contact')
        }
        if (vehicle_name == '' || vehicle_name == undefined) {
            return Response.sendFailedmsg(res, 'Vehicle Name Is Required')
        }
        if (vehicle_number == '' || vehicle_number == undefined) {
            return Response.sendFailedmsg(res, 'Vehicle Number Is Required')
        }
        if (invoice_number == '' || invoice_number == undefined) {
            return Response.sendFailedmsg(res, 'Invalid Invoice Number')
        }
        if (invoice_ref_number == '' || invoice_ref_number == undefined) {
            return Response.sendFailedmsg(res, 'Invalid Invoice Reference Number')
        }
        if (service_rep == '' || service_rep == undefined) {
            return Response.sendFailedmsg(res, 'Invalid Service Rep')
        }



        const order = new Order({
            customer_name: customer_name,
            customer_contact: customer_contact,
            customer_trn: customer_trn,
            vehicle_name: vehicle_name,
            vehicle_number: vehicle_number,
            type: type,
            service: serviceArray,
            wash_service: washserviceArray,
            invoice_number: invoice_number,
            invoice_ref_number: invoice_ref_number,
            service_rep: service_rep,
            payment: paymentDetails
        })

        order.save().then((data) => {
            return Response.sendSuccessmsg(res, 'Order Created')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Create Order!', err.message)
            })
    } catch (err) {
        return Response.sendFailedmsg(res, 'Failed To Create Order!', err.message)
    }
}

exports.getOrders = (req, res) => {
    try {

        Order.find().then((data) => {
            res.send(data)
        })
            .catch(err => {
                res.send([])
            })
    } catch (err) {
        res.send([])
    }
}


exports.getSingleOrder = (req, res) => {
    try {

        Order.findById(req.params.id).then((data) => {
            res.send(data)
        })
            .catch(err => {
                res.send([])
            })
    } catch (err) {
        res.send([])
    }
}


exports.orderReport = (req, res) => {
    try {

        const {start_date, end_date, service_rep} = req.body
        const {limit = 10, page = 1} = req.query

        let startDate
        let endDate


         startDate = new Date(start_date)
         endDate = new Date(end_date)

        if (start_date && end_date) {
            Order.find({order_date: {$gt: startDate, $lt: endDate}})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send([])
                })

        } else if (start_date) {
            Order.find({order_date: {$gt: startDate}})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send([])
                })
        } else if (end_date) {
            Order.find({order_date: {$lt: endDate}})
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send([])
                })
        } else if (service_rep) {
            Order.find({service_rep: service_rep})
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


    } catch (err) {
        res.send([])
    }
}

exports.getOrderDetails = async (req, res) => {

    try {
        const today_net_total = await Order.aggregate([
            {$match: {order_date: {$gte: new Date(Date.now() - 24 * 60 * 60 * 1000)},order_status:true}},
            {$group: {_id: "", net_total: {$sum: "$payment.net_total"}}}
        ])

        const today_total_wash = await Order.find({type: 'Wash',order_date:{$gte: new Date(Date.now() - 24 * 60 * 60 * 1000)}}).countDocuments()
        const today_total_service = await Order.find({type: 'Service',order_date:{$gte: new Date(Date.now() - 24 * 60 * 60 * 1000)}}).countDocuments()
        const total_service = await Order.find().countDocuments()

        let daily_net_total
        if(today_net_total === undefined || today_net_total == '') {
            daily_net_total = 0
        }
        else {
            daily_net_total = today_net_total
        }
        const order_details = {
            today_net_total: daily_net_total,
            today_total_wash: today_total_wash,
            today_total_service: today_total_service,
            total_service: total_service

        }
        res.send(order_details)
    } catch (err) {
        res.send(err.message)
    }
}

exports.getRecentOrders = (req, res) =>{

    try {

        const query = [
            {
                path:'service.service_id',
                select:'title'
            },
            {
                path:'wash_service.service_id',
                select:'title'
            },
            {
                path:'service.brand_id',
                select:'brandName'
            },
            // {
            //     path:'service.varient',
            //     select:'name'
            // }
        ]
        Order.find({order_status:true,order_date:new Date(Date.now() - 24 * 60 * 60 * 1000)}).populate(query).sort({_id:-1}).limit(30).then((orders) => {
            res.send(orders)
        })
        .catch(err => {
            res.send([])
        })
    }

    catch(err) {
        res.send([])
    }
}

exports.dailyGross =  (req, res) => {

    try {
        const daily_gross =   Order.aggregate([
            {
                $group :{
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$order_date" } },
                    net_total: {$sum: "$payment.net_total"},
                    order_status:true
                }
            },
            {
                $sort: { _id: -1 }
              },
              { $limit : 7 }
        ]).then((result) => {
            res.send(result)
        })
        .catch(err => {
            res.send([])
        })
    }
    catch(err) {
        res.send([])
    }
}

exports.monthlyGross =  async (req, res) => {

    try {
        // let monthly_gross_array = []
        let month_arr = []
        let net_total_arr = []
        const monthObj = {
            01:'Jan',
            02:'Feb',
            03:'Mar',
            04:'Apr',
            05:'May',
            06:'June',
            07:'July',
            08:'Aug',
            09:'Sep',
            10:'Oct',
            11:'Nov',
            12:'Dec'
        }
        const monthly_gross = await Order.aggregate([
            {
                $group :
                {
                    _id: { $dateToString: { format: "%m", date: "$order_date", } },
                    net_total: {$sum: "$payment.net_total"},
                    order_status:true
                }
            },
                {
                    $sort: { _id: -1 }
                },
                {
                    $limit : 5
                }
        ])

    //   for (key of monthly_gross ) {
    //       const month_num = parseInt(key._id)
    //       monthly_gross_array.push({
    //           month:monthObj[month_num],
    //           net_total:key.net_total
    //       })
    //   }
      for (key of monthly_gross ) {
          const month_num = parseInt(key._id)
          month_arr.push(
              monthObj[month_num]
          )
          net_total_arr.push(
              key.net_total
          )
      }

      let monthly_data = {
          month:month_arr,
          net_total:net_total_arr
      }

      res.send(monthly_data)

    }
    catch(err) {
        res.send([])
    }
}

exports.updateOrder = (req, res) => {
    try {

        const serviceArray = []
        const washserviceArray = []

        let service_items
        let wash_service_items


        const service = req.body.service
        const wash_service = req.body.wash_service
        const payment = req.body.payment
        const status = req.body.status == undefined ? JSON.parse('false') : JSON.parse(req.body.status);

        if(service === undefined && wash_service === undefined ) {
            return Response.sendFailedmsg(res,'Please Specify Service Details')
        }


        if(service != undefined && service!= null ) {
            let items = typeof(service) == "string" ? JSON.parse(service) : service
            if (items.length > 0) {
                for (services of items) {
                        serviceArray.push({
                            service_id: services.service_id,
                            brand_id: services.brand_id,
                            varient: services.varient_id,
                            price:services.price,
                            qty:services.qty,
                            tax_amount : services.tax,
                            total_price:services.total
                        })
                }

            }
            else {
                return Response.sendFailedmsg(res,'Please Specify Service Details')
            }
        }

        if (wash_service != undefined && wash_service != null) {
            let items = typeof(wash_service) == "string" ? JSON.parse(wash_service) : wash_service
            if (items.length > 0) {
                for (wash_services of items) {
                    service_id = wash_services.service_id
                    washserviceArray.push({
                        service_id: service_id,
                        price:wash_services.price,
                        qty:wash_services.qty,
                        tax_amount : wash_services.tax,
                        total_price:wash_services.total
                    })
                }

            }
            else {
                return Response.sendFailedmsg(res,'Please Specify Service Details')
            }
        }

        // console.log(washserviceArray)


        const taxable_amount = parseFloat(payment.subtotal) - parseInt(payment.discount)

        const paymentDetails = {
            payment_mode: payment.payment_mode,
            payment_date: payment.payment_date,
            subtotal: payment.subtotal,
            discount: payment.discount,
            taxable_amount: taxable_amount,
            vat_total: payment.vat_total,
            net_total: payment.net_total,
            payment_status: status
        }

        // res.send(paymentDetails)


        const {
            customer_name,
            customer_contact,
            customer_trn,
            vehicle_name,
            vehicle_number,
            invoice_number,
            invoice_ref_number,
            type,
            service_rep
        } = req.body

        if (customer_name == '' || customer_name == undefined) {
            return Response.sendFailedmsg(res, 'Name Is Required')
        }
        if (customer_contact == '' || customer_contact == undefined) {
            return Response.sendFailedmsg(res, 'Contact Is Required')
        }
        if (isNaN(customer_contact)) {
            return Response.sendFailedmsg(res, 'Invalid Contact')
        }
        if (vehicle_name == '' || vehicle_name == undefined) {
            return Response.sendFailedmsg(res, 'Vehicle Name Is Required')
        }
        if (vehicle_number == '' || vehicle_number == undefined) {
            return Response.sendFailedmsg(res, 'Vehicle Number Is Required')
        }
        if (invoice_number == '' || invoice_number == undefined) {
            return Response.sendFailedmsg(res, 'Invalid Invoice Number')
        }
        if (invoice_ref_number == '' || invoice_ref_number == undefined) {
            return Response.sendFailedmsg(res, 'Invalid Invoice Reference Number')
        }
        if (service_rep == '' || service_rep == undefined) {
            return Response.sendFailedmsg(res, 'Invalid Service Rep')
        }



        Order.findOneAndUpdate({_id:req.params.id},{
            customer_name: customer_name,
            customer_contact: customer_contact,
            customer_trn: customer_trn,
            vehicle_name: vehicle_name,
            vehicle_number: vehicle_number,
            type: type,
            service: serviceArray,
            wash_service: washserviceArray,
            invoice_number: invoice_number,
            invoice_ref_number: invoice_ref_number,
            service_rep: service_rep,
            payment: paymentDetails
        }).then((data) =>{
            return Response.sendSuccessmsg(res,'Order Updated')
        })
        .catch(err => {
            return Response.sendFailedmsg(res,'Failed To Update Order', err.message)
        })

    }
    catch(err) {
        return Response.sendFailedmsg(res,'Failed To Update Order', err.message)
    }
}

exports.deleteOrder = (req, res) => {
    try {
        Order.findOneAndUpdate({_id:req.params.id},{order_status:false}).then((result) => {
            return Response.sendSuccessmsg(res,'Order Deleted')
        })
        .catch(err => {
            return Response.sendFailedmsg(res,'Failed To Delete Order', err.message)
        })
    }
    catch(err) {
        return Response.sendFailedmsg(res,'Failed To Delete Order', err.message)
    }
}


exports.searchCustomer = async(req, res) => {

    try {

        const queryvalue = req.query.queryvalue
        if(queryvalue)
        {

            const srch = await Order.find({
                $or:[
                    {
                        customer_contact:{$regex:new RegExp(queryvalue)},

                    },
                    {
                        vehicle_number:{$regex:new RegExp(queryvalue)}
                    }
                ]
            },
            ).select('customer_name customer_contact customer_email vehicle_name vehicle_number')
            // .distinct('customer_contact')
            // const srch = await Order.aggregate([
            //     {$match: {customer_contact: new RegExp(queryvalue)}},
            //     {$group: {_id: {customer_contact:'$customer_contact'}}},
            // ])
            .then((result)=>{
                res.send(result)
            })

            .catch(err =>{
                res.send(err.message)
            })
        }


    }
    catch(err) {
            res.send(err.message)
    }
}

exports.searchByVehicleNumber = async(req, res) => {

    try {

        const q = req.query.q
        const srch = await Order.find({
            vehicle_number:{
                $regex:new RegExp(q)
            }
        }).select('customer_name customer_contact customer_email vehicle_name vehicle_number').then((result)=>{
            res.send(result)
        }).catch(err =>{
            res.send(err.message)
        })
    }
    catch(err) {
            res.send(err.message)
    }
}

exports.reportByService = (req, res) =>{
    try{
        const {start_date, end_date, service_type,service_rep} = req.body
        const {limit = 10, page = 1} = req.query

        let startDate
        let endDate
        let query = {}


        startDate = new Date(start_date)
        endDate = new Date(end_date)
        
        if (start_date && end_date) {
            if(service_type === "All"){
                Order.find({order_date: {$gt: startDate, $lt: endDate,service_rep:service_rep}}).select('customer_name customer_contact customer_email vehicle_name vehicle_number')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send(err.message)
                })
            }
            else{
                Order.find({order_date: {$gt: startDate, $lt: endDate,service_rep:service_rep,type:service_type}}).select('customer_name customer_contact customer_email vehicle_name vehicle_number')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send(err.message)
                })
            }
            

        } else if (start_date) {
            if(service_type === "All"){
                Order.find({order_date: {$gt: startDate, $lt: endDate,service_rep:service_rep}}).select('customer_name customer_contact customer_email vehicle_name vehicle_number')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send(err.message)
                })
            }
            else{
                Order.find({order_date: {$gt: startDate, $lt: endDate,service_rep:service_rep,type:service_type}}).select('customer_name customer_contact customer_email vehicle_name vehicle_number')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send(err.message)
                })
            }
        } else if (end_date) {
            if(service_type === "All"){
                Order.find({order_date: {$gt: startDate, $lt: endDate,service_rep:service_rep}}).select('customer_name customer_contact customer_email vehicle_name vehicle_number')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send(err.message)
                })
            }
            else{
                Order.find({order_date: {$gt: startDate, $lt: endDate,service_rep:service_rep,type:service_type}}).select('customer_name customer_contact customer_email vehicle_name vehicle_number')
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .then((data) => {
                    res.send(data)
                })
                .catch(err => {
                    res.send(err.message)
                })
            }

    }
}
    catch(err){
        res.send(err.message)
    }
}


exports.getFilteredRecentOrders = (req, res)=>{
    try {
        const {start_date, end_date} = req.body

        let startDate
        let endDate


        startDate = new Date(start_date)
        endDate = new Date(end_date)
        const query = [
            {
                path:'service.service_id',
                select:'title'
            },
            {
                path:'wash_service.service_id',
                select:'title'
            },
            {
                path:'service.brand_id',
                select:'brandName'
            },
            // {
            //     path:'service.varient',
            //     select:'name'
            // }
        ]
        Order.find({order_date: {$gt: startDate, $lt: endDate,order_status:true}}).populate(query).sort({_id:-1}).limit(30).then((orders) => {
            res.send(orders)
        })
        .catch(err => {
            res.send([])
        })
    }

    catch(err) {
        res.send([])
    }
}
