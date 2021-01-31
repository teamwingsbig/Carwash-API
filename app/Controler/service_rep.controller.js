const ServiceRep = require('../Models/service_rep.model') 
const Response   = require('../helper/response')
const emailValidator = require('email-validator')


// New Service Rep
exports.createServiceRep = (req, res) => {

    try {

        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/

        const { name, mobile, email, passcode, confirmpasscode, password, confirmpassword } = req.body

        if(!name || !mobile || !email || !passcode || !password) {
            return Response.sendFailedmsg(res,'Please Fill All Fields')
        }
        
        if(name.match(AlphaRegEx) == null) {
            return Response.sendFailedmsg(res,'Name Should Contain Only Alphabet')
        }

        if(isNaN(mobile) || mobile.length != 10) {
            return Response.sendFailedmsg(res,'Mobile Number Should Be Numeric And Of 10 Digit')
        }

        if(!emailValidator.validate(email)){
            return Response.sendFailedmsg(res,'Invalid Email Address')
        }

        if(passcode.length != 4) {
            return Response.sendFailedmsg(res,'Passcode Length Should Be 4')
        }

        if(password.length < 6 || password.length > 8) {
            return Response.sendFailedmsg(res,'Password Length Should Be Minimum  Of 6 or Maximum Length Of 8')
        }

        if(passcode != confirmpasscode) {
            return Response.sendFailedmsg(res,'Passcode Mismatch')
        }
        if(password != confirmpassword) {
            return Response.sendFailedmsg(res,'Password Mismatch')
        }

       

        const servicerep =  new ServiceRep({
            name:name,
            mobile:mobile,
            email:email,
            passcode:passcode,
            password:password
        })

        servicerep.save().then((data) => {
            return Response.sendSuccessmsg(res,'New Service Rep Added')
        })
        .catch(err=> {
            return Response.sendFailedmsg(res,'Failed To Add Service Rep',err.message)
        })
    }

    catch(err) {

        return Response.sendFailedmsg(res,'Failed To Add Service Re',err.message)
    }
}



// get service rep
exports.getServiceRep = (req, res) => {

    try {

        ServiceRep.find().then((data) => {
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


// get by id
exports.getSingleServiceRep = (req, res) => {
    try {

        ServiceRep.findById(req.params.id).then((data) => {
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

// delete service rep ( changes active status)
exports.removeServiceRep = (req, res) => {

    try {

        ServiceRep.findOneAndUpdate({_id:req.params.id},{status:false}).then(data =>{
            return Response.sendSuccessmsg(res,'Service Rep Has Been Removed')
        }).catch(err =>{
            return Response.sendFailedmsg(res,'Failed To Remove Service Rep',err.message)
        })
    }
    catch(err) {
        return Response.sendFailedmsg(res,'Failed To Remove Service Rep',err.message)
    }
}

// update service rep

exports.updateServiceRep = (req, res) => {

    try {

        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/

        const { name, mobile, email, passcode, confirmpasscode, password, confirmpassword } = req.body

        if(!name || !mobile || !email || !passcode || !password) {
            return Response.sendFailedmsg(res,'Please Fill All Fields')
        }
        
        if(name.match(AlphaRegEx) == null) {
            return Response.sendFailedmsg(res,'Name Should Contain Only Alphabet')
        }

        if(isNaN(mobile) || mobile.length != 10) {
            return Response.sendFailedmsg(res,'Mobile Number Should Be Numeric And Of 10 Digit')
        }

        if(!emailValidator.validate(email)){
            return Response.sendFailedmsg(res,'Invalid Email Address')
        }

        if(passcode.length != 4) {
            return Response.sendFailedmsg(res,'Passcode Length Should Be 4')
        }

        if(password.length < 6 || password.length > 8) {
            return Response.sendFailedmsg(res,'Password Length Should Be Minimum  Of 6 or Maximum Length Of 8')
        }

        if(passcode != confirmpasscode) {
            return Response.sendFailedmsg(res,'Passcode Mismatch')
        }
        if(password != confirmpassword) {
            return Response.sendFailedmsg(res,'Password Mismatch')
        }

       

        const servicerep =  new ServiceRep({
            name:name,
            mobile:mobile,
            email:email,
            passcode:passcode,
            password:password
        })

        ServiceRep.findOneAndUpdate({_id:req.params.id},{
            name:name,
            mobile:mobile,
            email:email,
            passcode:passcode,
            password:password
        }).then(data=> {
            return Response.sendSuccessmsg(res,'Service Rep Details Updated')
        })
        .catch(err => {
            return Response.sendFailedmsg(res,'Failed To Update Service Rep Details',err.message)
        })
    }
    catch(err) {
        return Response.sendFailedmsg(res,'Failed To Update Service Rep Details',err.message)
    }
}