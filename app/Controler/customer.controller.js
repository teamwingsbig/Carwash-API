const Customer = require('../Models/customer.model')
const Response = require('../helper/response')
const path = require('path')

exports.createCustomer = (req, res) => {
    try {
        const {name, address, mobile, TRN, type} = req.body
        if (!name) {
            return Response.sendFailedmsg(res, 'Please Fill All Fields')
        }

        const customer = new Customer({
            name: name,
            address: address,
            mobile: mobile,
            trn: TRN,
            customerType: type
        })

        customer.save().then(company => {
            return Response.sendSuccessmsg(res, 'Customer Details Added')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Add Customer Details', err.message)
            })

    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Create Customer ', err.message)
    }
}

exports.updateCustomer = (req, res) => {
    try {
        const {name, address, mobile, TRN, type} = req.body
        if (!name) {
            return Response.sendFailedmsg(res, 'Please Fill All Fields')
        }
        Customer.findOneAndUpdate({_id: req.params.id}, {
            name: name,
            address: address,
            mobile: mobile,
            trn: TRN,
            customerType: type
        }).then(company => {
            return Response.sendSuccessmsg(res, 'Customer Details Updated')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Update Customer Details', err.message)
            })
    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Create Customer ', err.message)
    }
}
exports.getCustomer = (req, res) => {
    try {


        Customer.find({
            status: true
        })
            .populate('customerType', '_id name')
            .sort({createdAt: -1}).then((customer) => {
            res.send(customer)
        })
            .catch(err => {
                res.send([])
            })


    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Create Customer ', err.message)
    }
}
exports.getSingleCustomer = (req, res) => {

    try {

        Customer.findById(req.params.id).then((data) => {
            res.send({data})
        })
            .catch(err => {
                res.send([])
            })

    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Create Customer ', err.message)
    }

}
exports.deleteCustomer = (req, res) => {
    try {
        Customer.findOneAndUpdate({_id: req.params.id}, {status: false}).then((data) => {
            return Response.sendSuccessmsg(res, 'Customer Deleted')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Delete Customer', err.message)
            })
    } catch (err) {
        return Response.sendFailedmsg(res, 'Failed To Delete Customer', err.message)
    }
}
