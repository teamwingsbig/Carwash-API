const User  = require('../Models/users.model')
const Response = require('../helper/response')


exports.createAdmin = (req, res) => {
    try {

        const { username, password } = req.body

        const user = new User({
            username:username,
            passcode:password,
            password:password,
            isadmin:true
        })

        user.save().then((data) => {
            return Response.sendFailedmsg(res,'Admin Added')
        })
        .catch(err => {
            return Response.sendFailedmsg(res,'Failed To Add Admin',err.message)
        })


    }
    catch(err) {
        return Response.sendFailedmsg(res,'Failed To Add Admin',err.message)
    }
}


exports.getUsers = (req,res) => {
    try {
         User.find().then((data) => {
             res.send(data)
         })
         .catch(err => {
             res.send(err.message)
         })
     }
     catch(err) {
         res.send(err.message)
     }
     
 }


 exports.authentication = (req, res) => {

     try {

        const { passcode, password} = req.body


        if(passcode) {
            User.findOne({passcode:passcode})
            .then((authuser) => {
                if(!authuser) {
                    return Response.sendFailedmsg(res,'Authentication Failed')
                }
                else {
                    return Response.sendSuccessmsg(res,'Authenticated!',{isAdmin:authuser.isadmin, email:authuser.username,_id:authuser._id})
                }
            })
            .catch(err => {
                return Response.sendFailedmsg(res,'Authentication Failed',err.message)
            })
        }

        if(password) {
            User.findOne({password:password})
            .then((authuser) => {
                if(!authuser) {
                    return Response.sendFailedmsg(res,'Authentcation Failed')
                }
                else {
                    return Response.sendSuccessmsg(res,'Authenticated!',{isAdmin:authuser.isadmin,email:authuser.username})
                }
            })
            .catch(err => {
                return Response.sendFailedmsg(res,'Authentication Failed',err.message)
            })
        }

     }
     catch(err) {
        return Response.sendFailedmsg(res,'Authentication Failed',err.message)
     }
 }
