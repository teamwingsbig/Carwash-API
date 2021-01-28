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
        if(varientArray.length<=0){
            return res.send("Specify Varient")
        }
        const name = service.name
        const brand_id = service.brand_id
        if(!name || !brand_id){
            return res.send("Please specify subservice")
        }
        sub_serviceArray.push({
            name: name,
            brand_id: brand_id,
            varients: varientArray
        })
    }

    const {title,description,type} = req.body
    if(!title){
        return res.send("Plese enter title")
    }
    if(!description){
        return res.send("Plese enter description")
    }
    if(!description){
        return res.send("Plese select servicetype")
    }
    if(title.match(AlphaRegEx) == null){
        return res.send("title should be alphabetic")
    }
    if(type.match(AlphaRegEx) == null){
        return res.send("Service type should be alphabetic")
    }

    if( type == "Service" && sub_service.length <=0 ){
        return res.send("Specify sub services")        
    }
    if( type == "Wash" && sub_service.length>0){
        return res.send("Could not add service ")
    }
    
   

    const service = new Service({
        title: title,
        description: description,
        type:type,
        sub_services: (sub_serviceArray)
    });

    service.save().then(service=>{
        return Response.sendSuccessmsg(res,'Service Added')
    })
    .catch(err=>{
        return Response.sendFailedmsg(res,'Failed To Add Service')
    })


    }
    catch(err){
        return Response.sendFailedmsg(res,'Failed To Add Service')
    }
}

exports.getService = (req, res) => {
    try{
        Service.find().then((brand)=>{
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