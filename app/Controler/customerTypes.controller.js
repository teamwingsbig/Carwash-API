const CustomerTypes = require('../Models/customerTypes.model')
const Response = require('../helper/response')
const path = require('path')

exports.createType = (req, res) => {
    try {
        const {name} = req.body
        if (!name) {
            return Response.sendFailedmsg(res, 'Please Fill All Fields')
        }

        const customerType = new CustomerTypes({
            name: name,
            status: true
        })

        customerType.save().then(company => {
            return Response.sendSuccessmsg(res, 'Customer Type Added')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Add Customer type', err.message)
            })

    } catch {
    }
}

