const Emirate = require('../Models/emirates.model')
const Response = require('../helper/response') 


// post data
exports.createEmirate = (req, res) => {

    try {
        
        const categories = req.body.category
        const categoryArray = [];   
        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/   
        
        for (const category of categories) {
            
            const emirate_category = category.emirate_category
            
            if(emirate_category.match(AlphaRegEx) == null) {
                return Response.sendFailedmsg(res,'Emirate Category Should Be In Alphabets')
            }
            categoryArray.push({
                emirate_category:emirate_category
            })
        }

        const {emirate_name} = req.body

        if(!emirate_name || categoryArray.length<=0){
            return Response.sendFailedmsg(res,'Please Fill All Fields')
        }

        const emirate = new Emirate({
            emirate_name:emirate_name,
            category:categoryArray 
        });

        emirate.save().then(data => {
            return Response.sendSuccessmsg(res,'Emirate Number Plate Category Added')
        })
        .catch(err =>{
            return Response.sendFailedmsg(res,'Failed To Add Emirate Category',err.message)
        })
    }

    catch(err){
        return Response.sendFailedmsg(res,'Error',err.message)
    }
}

// get data
exports.getEmirate = (req, res) => {

    try{
        Emirate.find({status:true}).then((emirate)=>{
            res.send(emirate)
        })
        .catch(err=>{
            res.send([])
        })       
    }
    catch(err){
     res.send([])
    }
}


// get by id
exports.getSingleEmirate = (req,res) =>{

    try{
        Emirate.findById(req.params.id).then((emirate)=>{
            res.send(emirate)
        })
        .catch(err=>{
            res.send([])
        })    
     }
     catch(error){
         res.send([])
     }
}


//  delete emirate (change status:false )

exports.deleteEmirate = (req,res) => {

    try {

        Emirate.findOneAndUpdate({_id:req.params.id},{status:false}).then((data)=>{
            return Response.sendSuccessmsg(res,'Emirate Removed')
        })
        .catch(err =>{
            return Response.sendFailedmsg(res,'Failed To Remove Emirate',err.message)
        })
    }
    catch(err){
        return Response.sendFailedmsg(res,'Failed To Remove Emirate',err.message)
    }
}


// update emirate details
exports.updateEmirate = (req, res) => {

    try {

        const categories = req.body.category
        const categoryArray = [];   
        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/

        for (const category of categories) {
            
            const emirate_category = category.emirate_category
            
            if(emirate_category.match(AlphaRegEx) == null) {
                return Response.sendFailedmsg(res,'Emirate Category Should Be In Alphabets')
            }
            categoryArray.push({
                emirate_category:emirate_category
            })        
        }

        const {emirate_name} = req.body

        if(!emirate_name || categoryArray.length<=0){
            return Response.sendFailedmsg(res,'Please Fill All Fields')
        }

        Emirate.findOneAndUpdate({_id:req.params.id},{
            emirate_name:emirate_name,
            category:categoryArray
        }).then((data) => {
            return Response.sendSuccessmsg(res,'Emirate Details Updated')
        })
        .catch(err => {
            return Response.sendFailedmsg(res,'Failed To Update Emirate Details',err.message)
        })
    }
    catch(err) {

        return Response.sendFailedmsg(res,'Failed To Update Emirate Details',err.message)
    }
}
