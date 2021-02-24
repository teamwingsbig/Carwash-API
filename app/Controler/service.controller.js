const Service = require('../Models/service.model');
const Response= require('../helper/response')


exports.createService = (req, res) => {

    try{

    const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/

    const brand = req.body.brand
    const brand_array = [];
    const varientArray = [];
    

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

    if( type == "Service" && brand.length <=0 ){
        return Response.sendFailedmsg(res,"Specify brand details")        
    }
    if( type == "Wash" && brand.length>0){
        return Response.sendFailedmsg(res,"Could not add service ")
    }

    if(brand) {
        for (const brands of brand) {
            for (const varients of brands.varients) {

                if(!varients.price || !varients.price) {
                    return Response.sendFailedmsg(res,'Please Fill Varient Details')
                }
                varientArray.push({
                    name:varients.name,
                    price:varients.price
                })
            }
            
            const brand_id = brands.brand_id
    
            if(varientArray.length<=0){
                return Response.sendFailedmsg(res,"Specify Varient")
            }
            if(!brand_id){
                return Response.sendFailedmsg(res,"Please specify brand")
            }
            brand_array.push({
                brand_id: brand_id,
                varients: varientArray
            })
        }        
    } 
    let charges = charge
    if(type == 'Service') {
        charges = 0
    }   
    
   
    
    const service = new Service({
        title: title,
        description: description,
        type:type,
        brand: (brand_array),
        charge:charges,
        tax:tax

    });

    service.save().then(service=>{
        return Response.sendSuccessmsg(res,'Service Added')
    })
    .catch(err=>{
        return Response.sendFailedmsg(res,'Failed To Add Service',err.message)
    })
   res.send(service)

    }
    catch(err){
        return Response.sendFailedmsg(res,'Failed To Add Service',err.message)
    }
}

exports.getService = (req, res) => {
    try{
        const type= req.query.type

        if(type) {
            Service.find({type:type,status:true}).then((brand)=>{
                res.send(brand)
            })
            .catch(err=>{
                res.send([])
            })
        }
        else {
            Service.find({status:true}).then((brand)=>{
                res.send(brand)
            })
            .catch(err=>{
                res.send([])
            })
        }

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

        const  { title, description, type, charge, tax, vat} = req.body
        const brand = req.body.brand
        const brand_array = [];
        const varientArray = [];
        const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/


        for(const brands of brand){
            for(const varients of brands.varients){
                varientArray.push(varients)
            }
            const brand_id = brands.brand_id
            if(varientArray.length<=0){
                return Response.sendFailedmsg(res,"Specify Varient")
            }
            if(!brand_id){
                return  Response.sendFailedmsg(res,"Please specify brand")
            }
            brand_array.push({
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

        if( type == "Service" && brand.length <=0 ){
            return  Response.sendFailedmsg(res,"Specify varient")        
        }
        if( type == "Wash" && brand.length>0){
            return  Response.sendFailedmsg(res,"Could not add service")
        }

        Service.findByIdAndUpdate({_id:req.params.id},{
            title: title,
            description: description,
            type:type,
            brand: (brand_array),
            charge:charge,
            tax:tax,
            vat:vat 
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

exports.getVarientByBrand = (req, res) => {
    try {
        const brand_id = req.query.brand_id
        Service.find({'brand.brand_id':brand_id}).select('brand.varients').then((data) => {
        res.send(data)
        })
        .catch(err => {
            res.send([])
        })
    }
    catch(err) {
        res.send([])
    }
}
