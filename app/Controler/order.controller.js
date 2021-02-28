const Order = require('../Models/order.model')
const Response = require('../helper/response')
const emailValidator = require('email-validator')

exports.createOrder = (req, res) => {

    try {

        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/

        const serviceArray = []
        const washserviceArray = []


        const service = req.body.service
        const wash_service = req.body.wash_service
        const payment = req.body.payment
        const status = req.body.status == undefined ? JSON.parse('false') : JSON.parse(req.body.status);
        if (service) {
            for (services of service) {
                service_id = services.service_id,
                    brand_id = services.brand_id,
                    varient = services.varient
            }

            serviceArray.push({
                service_id: services.service_id,
                brand_id: services.brand_id,
                varient: services.varient
            })
        }

        if (wash_service != undefined && wash_service != null) {
            let items = JSON.parse(wash_service)
            if (items.length > 0) {
                for (wash_services of items) {
                    service_id = wash_services.service_id
                    washserviceArray.push({
                        service_id: service_id
                    })
                }

            }
        }

        // console.log(washserviceArray)


        const taxable_amount = parseFloat(payment.subtotal) - parseFloat(payment.discount)
        const vat_total = parseFloat(payment.vat_total)
        const net_total = taxable_amount + vat_total

        const paymentDetails = {
            payment_mode: payment.payment_mode,
            payment_date: payment.payment_date,
            subtotal: payment.subtotal,
            discount: payment.discount,
            taxable_amount: taxable_amount,
            vat_total: vat_total,
            net_total: net_total,
            payment_status: status
        }

        // res.send(paymentDetails)


        const {
            customer_name,
            customer_contact,
            customer_trn,
            vehicle_name,
            vehicle_number,
            type,
            invoice_number,
            invoice_ref_number,
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

        const startDate = new Date(start_date)
        const endDate = new Date(end_date)

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
            {$match: {order_date: {$gte: new Date(Date.now() - 24 * 60 * 60 * 1000)}}},
            {$group: {_id: "$net_total", net_total: {$sum: "$payment.net_total"}}}
        ])


        const today_total_wash = await Order.estimatedDocumentCount({type: 'wash'})
        const today_total_service = await Order.estimatedDocumentCount({type: 'service'})
        const total_service = await Order.find().estimatedDocumentCount()

        const order_details = {
            today_net_total: today_net_total,
            today_total_wash: today_total_wash,
            today_total_service: today_total_service,
            total_service: total_service

        }
        res.send(order_details)
        // console.log(total_service)
    } catch (err) {
        res.send([])
    }
}



