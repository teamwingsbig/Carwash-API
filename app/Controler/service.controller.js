const Service = require('../Models/service.model');
const Response = require('../helper/response')
const mongoose = require('mongoose');
const priceModel = require("../Models/price.model");
const CustomerTypes = require('../Models/customerTypes.model');
const { ObjectID, ObjectId } = require('bson');

exports.createService = (req, res) => {

    try {

        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/

        const brand = req.body.brand
        const brand_array = [];
        const varientArray = [];


        const {title, description, type, charge, tax} = req.body
        if (!title) {
            return Response.sendFailedmsg(res, "Plese enter title")
        }
        if (!description) {
            return Response.sendFailedmsg(res, "Plese enter description")
        }
        if (!type) {
            return Response.sendFailedmsg(res, "Plese select servicetype")
        }


        if (type == "Service" && brand.length <= 0) {
            return Response.sendFailedmsg(res, "Specify brand details")
        }
        if (type == "Wash" && brand.length > 0) {
            return Response.sendFailedmsg(res, "Could not add service ")
        }

        // if(brand) {
        //     for (const brands of brand) {
        //         for (const varients of brands.varients) {
        //
        //             if(!varients.price || !varients.price) {
        //                 return Response.sendFailedmsg(res,'Please Fill Varient Details')
        //             }
        //             varientArray.push({
        //                 name:varients.name,
        //                 price:varients.price
        //             })
        //         }
        //
        //         const brand_id = brands.brand_id
        //
        //         if(varientArray.length<=0){
        //             return Response.sendFailedmsg(res,"Specify Varient")
        //         }
        //         if(!brand_id){
        //             return Response.sendFailedmsg(res,"Please specify brand")
        //         }
        //         brand_array.push({
        //             brand_id: brand_id,
        //             varients: varientArray
        //         })
        //     }
        // }
        let charges = charge
        if (type == 'Service') {
            charges = 0
        }


        const service = new Service({
            title: title,
            description: description,
            type: type,
            brand: (brand),
            charge: charges,
            tax: tax

        });

        service.save().then(service => {
            //  console.log(service);
            if(service.type=="Service")
            {
                
                if(service.brand.length>0)
                {
                    service.brand.forEach(element => {
                        element.varients.forEach(variantElement => {
                            //here variant for each
                            //fetch customer type from table and insert each price to price split with variant id and customer type
                            CustomerTypes.find({status: true}).sort({createdAt: -1}).then((type) => {
                               type.forEach(customerTypeData => {
                                   customerType_id=customerTypeData._id;
                                   product_id=variantElement._id;
                                   price=variantElement.price;
                                  

                                   const priceData= new priceModel({
                                    customerType:customerType_id,
                                    service:product_id,
                                    price:price,
                                    serviceType:"Service"
                                   });
                                   
                                   priceData.save().then(priceData => {
                                 
                                })                                                                   
                               });
                            })
                               
                        });                     
                   });
                }
            
            }
            else if(service.type=="Wash")
            {
             
                if(service._id!=null)
                {
                   
                    CustomerTypes.find({status: true}).sort({createdAt: -1}).then((type) => {
                        type.forEach(customerTypeData => {
                            customerType_id=customerTypeData._id;
                            product_id=service._id;
                            price=service.charge;
                           

                            const priceData= new priceModel({
                             customerType:customerType_id,
                             service:product_id,
                             price:price,
                             serviceType:"Wash"
                            });
                            
                            priceData.save().then(priceData => {
                          
                         })                                                                   
                        });
                     })
                }
            }
            return Response.sendSuccessmsg(res, 'Service Added',{serviceId:service._id})
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Add Service', err.message)
            })
//    res.send(service)

    } catch (err) {
        return Response.sendFailedmsg(res, 'Failed To Add Service', err.message)
    }
}


exports.getVariants = (req, res) => {
    try {
        const {serviceId} = req.query
        const {brandId} = req.query
        console.log(brandId)
        console.log(serviceId)
        if (serviceId && brandId) {
            Service.find(
                {
                    status: true,
                    'brand.brand_id': mongoose.Types.ObjectId(brandId),
                    _id: mongoose.Types.ObjectId(serviceId), type: 'Service'
                }, {'brand.$.varients': 1}).then(service => {
                if (service) {
                    console.log(service[0].brand[0].varients)
                    res.send(service[0].brand[0].varients)
                } else {
                    res.send([])
                }

            }).catch(err => {
                console.log(err.message)
                res.send([])
            })
        } else {
            res.send([])

        }


    } catch (err) {
        res.send([])
    }
}
exports.getService = (req, res) => {
    try {
        const type = req.query.type
        const services = []

        if (type) {
            Service.find({
                type: type,
                status: true
            }).populate('brand.brand_id', 'brandName').sort({createdAt: -1}).then((service) => {
                res.send(service)
            })
                .catch(err => {
                    res.send([])
                })
        } else {
            Service.find({status: true}).populate('brand.brand_id', 'brandName').then((service) => {
                res.send(service)
            })
                .catch(err => {
                    res.send([])
                })
        }

    } catch (err) {
        res.send([])
    }
}

exports.getSingleService = (req, res) => {
    try {
        Service.findById(req.params.id).populate('brand.brand_id', 'brandName').then((data) => {
            res.send(data)
        })
            .catch(err => {
                res.send([])
            })
    } catch (err) {
        res.send([])
    }
}

exports.deleteService = (req, res) => {
    try {
        Service.findOneAndUpdate({_id: req.params.id}, {status: false}).then((data) => {
            return Response.sendSuccessmsg(res, 'Service Deleted')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Delete Service', err.message)
            })
    } catch (err) {
        return Response.sendFailedmsg(res, 'Failed To Delete Brand', err.message)
    }
}

exports.updateService = (req, res) => {
    try {

        const {title, description, type, charge, tax, vat} = req.body
        const brand = req.body.brand
        const brand_array = [];
        const varientArray = [];
        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/


        // for(const brands of brand){
        //     for(const varients of brands.varients){
        //         varientArray.push(varients)
        //     }
        //     const brand_id = brands.brand_id
        //     if(varientArray.length<=0){
        //         return Response.sendFailedmsg(res,"Specify Varient")
        //     }
        //     if(!brand_id){
        //         return  Response.sendFailedmsg(res,"Please specify brand")
        //     }
        //     brand_array.push({
        //         brand_id: brand_id,
        //         varients: varientArray
        //     })
        //
        // }

        if (!title) {
            return Response.sendFailedmsg(res, "Please enter title")
        }
        if (!description) {
            return Response.sendFailedmsg(res, "Please enter description")
        }
        if (!type) {
            return Response.sendFailedmsg(res, "Please select servicetype")
        }


        if (type == "Service" && brand.length <= 0) {
            return Response.sendFailedmsg(res, "Specify varient")
        }
        if (type == "Wash" && brand.length > 0) {
            return Response.sendFailedmsg(res, "Could not add service")
        }
        const options = { new: true };
        Service.findByIdAndUpdate({_id: req.params.id}, {
            title: title,
            description: description,
            type: type,
            brand: (brand),
            charge: charge,
            tax: tax,
            vat: vat
        },options).then((data) => {
            console.log(data);
            if(data.type=="Service")
            {
                data.brand.forEach(element => {
                    element.varients.forEach(variantElement => {
                        
                        priceModel.deleteMany({"service":ObjectId(variantElement._id)}, function(err, data){
                        
                        });
    
                        
                        //here variant for each
                        //fetch customer type from table and insert each price to price split with variant id and customer type
                        CustomerTypes.find({status: true}).sort({createdAt: -1}).then((type) => {
                           type.forEach(customerTypeData => {
                               customerType_id=customerTypeData._id;
                               product_id=variantElement._id;
                               price=variantElement.price;
                              

                               const priceData= new priceModel({
                                customerType:customerType_id,
                                service:product_id,
                                price:price,
                                serviceType:"Service"
                               });
                               
                               priceData.save().then(priceData => {
                             
                            })                                                                   
                           });
                        })
                           
                    });                     
               });
            }
            else if(data.type=="Wash")
            {
             
                if(data._id!=null)
                {
                  
                    // priceModel.deleteMany({service:data._id});
                    // priceModel.deleteMany({"service": ObjectId("619805e0a39e7633e438b65e")});


                    priceModel.deleteMany({"service":ObjectId(data._id)}, function(err, data){
                        
                    });

                  

                    CustomerTypes.find({status: true}).sort({createdAt: -1}).then((type) => {
                        type.forEach(customerTypeData => {
                            customerType_id=customerTypeData._id;
                            product_id=data._id;
                            price=data.charge;
                           

                            const priceData= new priceModel({
                             customerType:customerType_id,
                             service:product_id,
                             price:price,
                             serviceType:"Wash"
                            });
                            
                           priceData.save().then(priceData => {
                          
                         })                                                                   
                        });
                     })
                }
            }
            return Response.sendSuccessmsg(res, 'Service Updated')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Update Service', err.message)
            })

    } catch (err) {
        return Response.sendFailedmsg(res, 'Failed To Update Service', err.message)
    }
}

exports.getVarientByBrand = (req, res) => {
    try {
        const brand_id = req.query.brand_id
        Service.find({'brand.brand_id': brand_id}).select('brand.varients').then((data) => {
            res.send(data)
        })
            .catch(err => {
                res.send([])
            })
    } catch (err) {
        res.send([])
    }
}
 
