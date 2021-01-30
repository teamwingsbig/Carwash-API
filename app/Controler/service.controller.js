const Service = require('../Models/service.model');
const Response= require('../helper/response')


exports.createService = (req, res) => {

    try{

    const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/
    const sub_service = req.body.sub_services


    const sub_serviceArray = [];
    const varientArray = [];

    for (const service of sub_service) {
        for (const varients of service.varients) {
            varientArray.push(varients)
        }
        
        const name = service.name
        const brand_id = service.brand_id

        if(varientArray.length<=0){
            return Response.sendFailedmsg(res,"Specify Varient")
        }
        if(!name || !brand_id){
            return Response.sendFailedmsg(res,"Please specify subservice")
        }
        sub_serviceArray.push({
            name: name,
            brand_id: brand_id,
            varients: varientArray
        })
    }

    const {title,description,type,charge,tax } = req.body
    if(!title){
        return Response.sendFailedmsg(res,"Plese enter title")
    }
    if(!description){
        return Response.sendFailedmsg(res,"Plese enter description")
    }
    if(!type){
        return Response.sendFailedmsg(res,"Plese select servicetype")
    }
    if(title.match(AlphaRegEx) == null){
        return Response.sendFailedmsg(res,"title should be alphabetic")
    }
    if(type.match(AlphaRegEx) == null){
        return Response.sendFailedmsg(res,"Service type should be alphabetic")
    }

    if( type == "Service" && sub_service.length <=0 ){
        return Response.sendFailedmsg(res,"Specify sub services")        
    }
    if( type == "Wash" && sub_service.length>0){
        return Response.sendFailedmsg(res,"Could not add service ")
    }
    
   

    const service = new Service({
        title: title,
        description: description,
        type:type,
        sub_services: (sub_serviceArray),
        charge:charge,
        tax:tax

    });

    service.save().then(service=>{
        return Response.sendSuccessmsg(res,'Service Added')
    })
    .catch(err=>{
        return Response.sendFailedmsg(res,'Failed To Add Service',err.message)
    })


    }
    catch(err){
        return Response.sendFailedmsg(res,'Failed To Add Service',err.message)
    }
}

exports.getService = (req, res) => {
    try{
        Service.find({status:true}).then((brand)=>{
            res.send(brand)
        })
        .catch(err=>{
            res.send([])
        })
    }
    catch(err){
        res.send([])
    }
}

exports.getSingleService = (req, res) => {
    try{
        Service.findById(req.params.id).then((data)=>{
            res.send(data)
        })
        .catch(err=>{
            res.send([])
        })
    }
    catch(err){
        res.send([])
    }
}


exports.deleteService = (req, res) =>{
    try{
        Service.findOneAndUpdate({_id : req.params.id},{status : false}).then((data)=>{
            return Response.sendSuccessmsg(res,'Service Deleted')
        })
        .catch(err=>{
            return Response.sendFailedmsg(res,'Failed To Delete Service',err.message)
        })
    }
    catch(err){
        return Response.sendFailedmsg(res,'Failed To Delete Brand',err.message)
    }
}

exports.updateService = (req, res) => {
    try{

        const  { title, description, type, charge, tax} = req.body
        const sub_service = req.body.sub_services
        const sub_serviceArray = [];
        const varientArray = [];
        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/


        for(const service of sub_service){
            for(const varients of service.varients){
                varientArray.push(varients)
            }
            const name = service.name
            const brand_id = service.brand_id
            if(varientArray.length<=0){
                return Response.sendFailedmsg(res,"Specify Varient")
            }
            if(!name || !brand_id){
                return  Response.sendFailedmsg(res,"Please specify subservice")
            }
            sub_serviceArray.push({
                name: name,
                brand_id: brand_id,
                varients: varientArray
            })        
           
        }

        if(!title){
            return  Response.sendFailedmsg(res,"Plese enter title")
        }
        if(!description){
            return  Response.sendFailedmsg(res,"Plese enter description")
        }
        if(!type){
            return  Response.sendFailedmsg(res,"Plese select servicetype")
        }
        if(title.match(AlphaRegEx) == null){
            return Response.sendFailedmsg(res,"title should be alphabetic")
        }
        if(type.match(AlphaRegEx) == null){
            return  Response.sendFailedmsg(res,"Service type should be alphabetic")
        }

        if( type == "Service" && sub_service.length <=0 ){
            return  Response.sendFailedmsg(res,"Specify sub services")        
        }
        if( type == "Wash" && sub_service.length>0){
            return  Response.sendFailedmsg(res,"Could not add service")
        }

        Service.findByIdAndUpdate({_id:req.params.id},{
            title: title,
            description: description,
            type:type,
            sub_services: (sub_serviceArray),
            charge:charge,
            tax:tax 
        }).then((data)=>{
            return Response.sendSuccessmsg(res,'Service Updated')
        })
        .catch(err=>{
            return Response.sendFailedmsg(res,'Failed To Update Service',err.message)
        })

    }
    catch(err){
        return Response.sendFailedmsg(res,'Failed To Update Service',err.message)
    }
}