const Brand = require('../Models/vehicle-brand.model');
const Vehicle = require('../Models/vehicle.model');
const Response = require('../helper/response')

exports.createBrand = (req, res) => {
    try {
        const {name} = req.body


        if (!name) {
            return Response.sendFailedmsg(res, "PLease Fill All Fields")
        }


        const newBrand = new Brand({
            name: name
        })

        newBrand.save().then(newBrand => {
            return Response.sendSuccessmsg(res, 'Brand Added Successsfully', {id: newBrand._id})
            // res.send({
            //     status:true,
            //     message:"Brand Addded",
            //     _id:newBrand._id
            // })
        })

            .catch(err => {
                return Response.sendFailedmsg(res, "Failed To Add Brand")
                // res.send({
                //     status:false,
                //     message:"Failed To Add Brand",
                //     error:err.message
                // })
            })
    } catch (error) {
        return Response.sendFailedmsg(res, "Failed To Add Brand")

        // res.send({
        //     status:flase,
        //     message:"Failed To Add Brand",
        //     error:err.message
        // })

    }

}


exports.getBrand = (req, res) => {
    try {
        Brand.find({status: true}).sort({createdAt: -1}).then((brand) => {
            res.send(brand)
        })
            .catch(err => {
                res.send([])
            })

    } catch (e) {
        res.send([])
    }
}


exports.getSingleBrand = (req, res) => {

    const {id} = req.params
    try {
        Brand.findById(id).then((data) => {
            res.send(data)
        })
            .catch(err => {
                res.send([])
            })


    } catch (error) {
        res.send([])
    }

}

//change status (implementing deletion)
exports.deleteBrand = (req, res) => {
    try {
        const {id} = req.params

        Brand.findOneAndUpdate({_id: id}, {status: false}).then((data) => {
            return Response.sendSuccessmsg(res, 'Brand Deleted')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Delete Brand', err.message)
            })
    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Delete Brand', err.message)
    }
}

// update brand details 
exports.updateBrand = (req, res) => {
    try {

        // const {brandId} = req.params.id

        const name = req.body.name

        if (!name) {
            return Response.sendFailedmsg(res, "PLease Fill All Fields")
        }


        Brand.findOneAndUpdate({_id: req.params.id}, {name: name}).then((data) => {
            return Response.sendSuccessmsg(res, 'Brand Updated')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Update Brand', err.message)
            })
    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Update Brand', err.message)
    }
}


exports.addVehicle = (req, res) => {
    try {
        const {body} = req;
        const name = body.name;
        const brand = body.brand;

        if (!name || !brand) {
            return Response.sendFailedmsg(res, "PLease Fill All Fields")
        }


        const vehicle = new Vehicle({
            name: name,
            brand: brand
        })

        vehicle.save().then(vehicle => {
            return Response.sendSuccessmsg(res, 'Vehicle Added Successfully', {id: vehicle._id})

        })

            .catch(err => {
                return Response.sendFailedmsg(res, "Failed To Add Vehicle")

            })
    } catch (error) {
        return Response.sendFailedmsg(res, "Failed To Add Vehicle")


    }

}


exports.getVehicles = (req, res) => {
    try {
        Vehicle.find({status: true}).populate('brand', '_id name').sort({createdAt: -1}).then((brand) => {
            res.send(brand)
        })
            .catch(err => {
                res.send([])
            })

    } catch (e) {
        res.send([])
    }
}


exports.getVehicleById = (req, res) => {

    const {id} = req.params
    try {
        Vehicle.findById(id).populate('brand', '_id name').then((data) => {
            res.send(data)
        })
            .catch(err => {
                res.send([])
            })


    } catch (error) {
        res.send([])
    }

}


exports.deleteVehicle = (req, res) => {
    try {
        const {id} = req.params

        Vehicle.findOneAndUpdate({_id: id}, {status: false}).then((data) => {
            return Response.sendSuccessmsg(res, 'Vehicle Deleted')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Delete Vehicle', err.message)
            })
    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Delete Vehicle', err.message)
    }
}

exports.updateVehicle = (req, res) => {
    try {


        // const {brandId} = req.params.id

        const {body} = req;
        const name = body.name
        const brand = body.brand

        if (!name | !brand) {
            return Response.sendFailedmsg(res, "PLease Fill All Fields")
        }


        Vehicle.findOneAndUpdate({_id: req.params.id}, {name: name, brand: brand}).then((data) => {
            return Response.sendSuccessmsg(res, 'Vehicle  Updated')
        })
            .catch(err => {
                return Response.sendFailedmsg(res, 'Failed To Update Vehicle', err.message)
            })
    } catch (error) {
        return Response.sendFailedmsg(res, 'Failed To Update Vehicle', err.message)
    }
}
