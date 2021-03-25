const Brand = require('../Models/brand.model');
const Response= require('../helper/response')

exports.createBrand = (req, res) => {
    try 
    {
    const { Name } = req.body


    if(!Name){
        return Response.sendFailedmsg(res,"PLease Fill All Fields")
    }
   

    const newBrand = new Brand({
        brandName : Name
    })

    newBrand.save().then(newBrand=>{
        return Response.sendSuccessmsg(res,'Brand Added Successsfully',{id:newBrand._id})
        // res.send({
        //     status:true,
        //     message:"Brand Addded",
        //     _id:newBrand._id
        // })
    })

    .catch(err=>{
        return Response.sendFailedmsg(res,"Failed To Add Brand")
        // res.send({
        //     status:false,
        //     message:"Failed To Add Brand",
        //     error:err.message
        // })
    })
}
catch(error) {
    return Response.sendFailedmsg(res,"Failed To Add Brand")

    // res.send({
    //     status:flase,
    //     message:"Failed To Add Brand",
    //     error:err.message
    // })

}
    
}


exports.getBrand = (req, res) => {
   try{
       Brand.find({status:true}).then((brand)=>{
           res.send(brand)
       })
       .catch(err=>{
           res.send([])
       })
      
   }
   catch(e){
    res.send([])
   }
}


exports.getSingleBrand =  (req, res) => {

    try{
       Brand.findById(req.params.id).then((data)=>{
           res.send(data)
       })
       .catch(err=>{
           res.send([])
       })
        
   
    }
    catch(error){
        res.send([])
    }

}

//change status (implementing deletion)
exports.replaceBrand = (req, res) => {
    try{

        Brand.findOneAndUpdate({_id:req.params.id},{status:false}).then((data)=>{
            return Response.sendSuccessmsg(res,'Brand Deleted')
        })
        .catch(err=>{
            return Response.sendFailedmsg(res,'Failed To Delete Brand',err.message)
        })
    }
    catch(error){
        return Response.sendFailedmsg(res,'Failed To Delete Brand',err.message)
    }
}

// update brand details 
exports.updateBrand = (req, res) => {
    try{

        // const {brandId} = req.params.id
       
        const brandName  = req.body.brandName  
        console.log(brandName)

        if(!brandName){
            return Response.sendFailedmsg(res,"PLease Fill All Fields")
        }
       
        
       
        Brand.findOneAndUpdate({_id:req.params.id},{brandName:brandName}).then((data)=>{
            return Response.sendSuccessmsg(res,'Brand Updated')
        })
        .catch(err=>{
            return Response.sendFailedmsg(res,'Failed To Update Brand',err.message)
        })
    }
    catch(error){
        return Response.sendFailedmsg(res,'Failed To Update Brand',err.message)
    }
}