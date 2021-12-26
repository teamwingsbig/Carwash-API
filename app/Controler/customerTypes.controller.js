const CustomerTypes = require('../Models/customerTypes.model')
const Response = require('../helper/response')
const path = require('path')
const Brand = require("../Models/brand.model");
const productList = require("../Models/service.model");
const priceSlab = require("../Models/price.model");
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
            productList.find({status: true}).sort({createdAt: -1}).then((type) => {          
                type.forEach(list => {    
                    if(list.type=="Wash")
                    {                        
                        const priceData= new priceSlab({
                            customerType:company._id,
                            service:list._id,
                            price:list.charge,
                            serviceType:"Wash"ivde 
                           });
                           
                           priceData.save().then(priceData => {
                               console.log(priceData);                         
                        }) 
                    }
                    else if(list.type=="Service")
                    {
                        if(list.brand.length>0)
                        {
                            list.brand.forEach(element => {
                                element.varients.forEach(variantElement => {
                                    product_id=variantElement._id;
                                    price=variantElement.price;
                                   
 
                                    const priceData= new priceSlab({
                                     customerType:company._id,
                                     service:product_id,
                                     price:price,
                                     serviceType:"Service"
                                    });
                                    
                                    priceData.save().then(priceData => {
                                        console.log(priceData);
                                  
                                 })   
                                });                     
                           });
                        }
                    }
                                                    
                });
             })
           
            return Response.sendSuccessmsg(res, 'Customer Type Added')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Add Customer type', err.message)
            })

    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Create Customer Type', err.message)
    }
}


exports.getCustomerType = (req, res) => {
    try {
        CustomerTypes.find({status: true}).sort({createdAt: -1}).then((type) => {
            res.send(type)
        })
            .catch(err => {
                res.send([])
            })

    } catch (e) {
        res.send([])
    }
}
exports.getSingleType = (req, res) => {

    try {
        CustomerTypes.findById(req.params.id).then((data) => {
            res.send(data)
        })
            .catch(err => {
                res.send([])
            })


    } catch (error) {
        res.send([])
    }

}

exports.deleteType = (req, res) => {
    try {

        CustomerTypes.findOneAndUpdate({_id: req.params.id}, {status: false}).then((data) => {
            return Response.sendSuccessmsg(res, 'Customer Type Deleted')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Delete Customer Type', err.message)
            })
    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Delete Customer Type', err.message)
    }
}

exports.updateType= (req, res) => {
    try {

        // const {brandId} = req.params.id

        const {name} = req.body

        if (!name) {
            return Response.sendFailedmsg(res, "PLease Fill All Fields")
        }


        CustomerTypes.findOneAndUpdate({_id: req.params.id}, {name: name}).then((data) => {
            return Response.sendSuccessmsg(res, 'Customer Type Updated')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Update Customer Type', err.message)
            })
    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Update Customer Type', err.message)
    }
}
