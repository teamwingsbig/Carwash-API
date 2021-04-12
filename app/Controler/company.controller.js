const Company  = require('../Models/company.model')
const Response = require('../helper/response')
const path = require('path')
const emailValidator = require('email-validator')


exports.createCompany = (req, res) => {
  try{
    
  const { name, address, arabicName, mobile, landPhone, currency, trn, tax, vat, email, termsandconditions } = req.body

  const logoFile = req.files.Logo
  const qrcodeFile = req.files.Qrcode

  const Logo = req.files.Logo.name
  const Qrcode = req.files.Qrcode.name

  const logoExtension =  path.extname(Logo) 
  const qrcodeExtension =  path.extname(Qrcode) 


  const allowExtensions = /png|jpeg|jpg|gif/
  const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/
  const mobRegex   = /^[0-9]{10}$/
  const landphoneRegex   = /^[0-9]{9}$/


  if(!logoFile || !qrcodeFile) {
    return Response.sendFailedmsg(res,'Please Include Logo/QRcode')
  }
  if(!allowExtensions.test(logoExtension) || !allowExtensions.test(qrcodeExtension)) {
    return Response.sendFailedmsg(res,'Invalide File Type! JPEG,PNG,JPEG,GIF Are Allowed')
  }
  if(req.files.Logo.data.length > 5000000 || req.files.Qrcode.data.length > 5000000){
    return Response.sendFailedmsg(res,'File Size SHould Be Less Than 5mb')
  }

  const Logomd5 = req.files.Logo.md5
  const Qrcodemd5 = req.files.Qrcode.md5
  
  const logoURL = './app/Files/Logo/' + Logomd5 + logoExtension
  const qrcodeURL = './app/Files/Qrcode/' + Qrcodemd5 + qrcodeExtension

  

   
  if(logoFile.mv(logoURL)){
    if(  qrcodeFile.mv(qrcodeURL)){

      if(!name || !address || !arabicName || !mobile || !landPhone || !currency || !trn || !tax || !vat || !termsandconditions ) {
        return Response.sendFailedmsg(res,'Please Fill All Fields')
      }
      //
      // if(name.match(AlphaRegEx) == null) {
      //   return Response.sendFailedmsg(res,'Name Should Only Contain Alphabets')
      // }
      if(mobile.match(mobRegex) == null) {
        return Response.sendFailedmsg(res,'Mobile Number Should Be Numeric And Of 10 Digits  ')
      }
      if(landPhone.match(landphoneRegex) == null) {
        return Response.sendFailedmsg(res,'Landphone Number Should Be Numeric And Of 9 Digits  ')
      }
      if(isNaN(tax) || isNaN(vat)){
        return Response.sendFailedmsg(res,'Tax/Vat Should Be Numeric')
      }
      if(!emailValidator.validate(email)) {
        return Response.sendFailedmsg(res,'Invalid Email Address ')
      }

      const company = new Company({
        name :name,
        address:address,
        arabicName:arabicName,
        mobile:mobile,
        landPhone:landPhone,
        currency:currency,
        trn:trn,
        tax:tax,
        vat:vat,
        email:email,
        logo:logoURL,
        locationqr:qrcodeURL,
        termsandconditions:termsandconditions
      })
      
    
      company.save().then(company => {
          return Response.sendSuccessmsg(res,'Company Details Added')
      })
      .catch(err=>{
        return Response.sendFailedmsg(res,'Failed To Add Company Details',err.message)
      })
    
    
    }
    else{
      return Response.sendFailedmsg(res,'Something Wrong With The File')
    }     


    }
    else{
      return Response.sendFailedmsg(res,'Something Wrong With The File')
    }
  }

 
  catch(err){
    return Response.sendFailedmsg(res,'Failed To Add Company Details', err.message)
  }
} 



// get company details
exports.getCompany = (req, res) => {
  try {
   

      Company.find().then((company)=>{
          res.send(company)
      })
      .catch(err=>{
          res.send([])
      })
     
     
  }
  catch(e){
   res.send([])
  }
}


//get single record
exports.getSingleCompany =  (req, res) => {

  try {

     Company.findById(req.params.id).then((data)=>{
         res.send({data})
     })
     .catch(err=>{
         res.send([])
     })      
 
  }
  catch(error){
      res.send([])
  }

}

exports.updateCompany = (req, res) => {
  try {


    const logoFile = req.files.Logo
    const qrcodeFile = req.files.Qrcode

    const allowExtensions = /png|jpeg|jpg|gif/
    const AlphaRegEx = /^(?!-)[a-zA-Z-]*[a-zA-Z]$/
    const mobRegex   = /^[0-9]{10}$/
    const landphoneRegex   = /^[0-9]{9}$/
  
    const { name, address, arabicName, mobile, landPhone, currency, trn, tax, vat, email, termsandconditions } = req.body


    if(!name || !address || !arabicName || !mobile || !landPhone || !currency || !trn || !tax || !vat || !termsandconditions ) {
      return Response(res,'Please Fill All Fields')
    }

    if(name.match(AlphaRegEx) == null) {
      return Response.sendFailedmsg(res,'Name Should Only Contain Alphabets')
    }
    if(mobile.match(mobRegex) == null) {
      return Response.sendFailedmsg(res,'Mobile Number Should Be Numeric And Of 10 Digits  ')
    }
    if(landPhone.match(landphoneRegex) == null) {
      return Response(res,'Landphone Number Should Be Numeric And Of 9 Digits  ')
    }
    if(isNaN(tax) || isNaN(vat)){
      return Response.sendFailedmsg(res,'Tax/Vat Should Be Numeric')
    }
    if(!emailValidator.validate(email)) {
      return Response.sendFailedmsg(res,'Invalid Email Address ')
    }


    // checking if logo file is in update request
    if(logoFile) {

      const Logo = logoFile.name
      const logoExtension =  path.extname(Logo)

      if(!allowExtensions.test(logoExtension)) {
        return Response.sendFailedmsg(res,'Invalide File Type! JPEG,PNG,JPEG,GIF Are Allowed')
      }
      if(req.files.Logo.data.length > 5000000){
        return Response.sendFailedmsg(res,'File Size SHould Be Less Than 5mb')
      }
    
      const Logomd5 = req.files.Logo.md5
      const logoURL = './app/Files/Logo/' + Logomd5 + logoExtension
      

      if(logoFile.mv(logoURL)){
        Company.findOneAndUpdate({_id:req.params.id},{
          name :name,
          address:address,
          arabicName:arabicName,
          mobile:mobile,
          landPhone:landPhone,
          currency:currency,
          trn:trn,
          tax:tax,
          vat:vat,
          email:email,
          logo:logoURL,        
          termsandconditions:termsandconditions
        }).then(company => {
          return Response.sendSuccessmsg(res,'Company Details Updated')
        })
        .catch(err => {
          return Response.sendFailedmsg(res,'Failed To Update Company Details',err.message)
        })
      }
    }


     // checking if qrcode file is in update request
     if(qrcodeFile) {

      const Qrcode = qrcodeFile.name  
      const qrcodeExtension =  path.extname(Qrcode) 

      if(!allowExtensions.test(qrcodeExtension)) {
        return Response.sendFailedmsg(res,'Invalide File Type! JPEG,PNG,JPEG,GIF Are Allowed')
      }
      if(req.files.Qrcode.data.length > 5000000){
        return Response.sendFailedmsg(res,'File Size SHould Be Less Than 5mb')
      }
    
      const Qrcodemd5 = req.files.Qrcode.md5
      const qrcodeURL = './app/Files/Qrcode/' + Qrcodemd5 + qrcodeExtension

      if(qrcodeFile.mv(qrcodeURL)){
        Company.findOneAndUpdate({_id:req.params.id},{
          name :name,
          address:address,
          arabicName:arabicName,
          mobile:mobile,
          landPhone:landPhone,
          currency:currency,
          trn:trn,
          tax:tax,
          vat:vat,
          email:email,
          locationqr:qrcodeURL,        
          termsandconditions:termsandconditions
        }).then(company => {
          return Response.sendSuccessmsg(res,'Company Details Updated')
        })
        .catch(err => {
          return Response.sendFailedmsg(res,'Failed To Update Company Details',err.message)
        })
      }
    }

    // checkin gif both qrcode and logo is in update request

    if(logoFile && qrcodeFile) {

      const Logo = req.files.Logo.name
      const Qrcode = req.files.Qrcode.name
    
      const logoExtension =  path.extname(Logo) 
      const qrcodeExtension =  path.extname(Qrcode)

      if(!allowExtensions.test(logoExtension) || !allowExtensions.test(qrcodeExtension)) {
        return Response.sendFailedmsg(res,'Invalide File Type! JPEG,PNG,JPEG,GIF Are Allowed')
      }
      if(req.files.Logo.data.length > 5000000 || req.files.Qrcode.data.length > 5000000){
        return Response.sendFailedmsg(res,'File Size SHould Be Less Than 5mb')
      }

      const Logomd5 = req.files.Logo.md5
      const Qrcodemd5 = req.files.Qrcode.md5
      
      const logoURL = './app/Files/Logo/' + Logomd5 + logoExtension
      const qrcodeURL = './app/Files/Qrcode/' + Qrcodemd5 + qrcodeExtension

      if(logoFile.mv(logoURL)){
        if(qrcodeFile.v(qrcodeURL)){
          Company.findOneAndUpdate({_id:req.params.id},{
            name :name,
            address:address,
            arabicName:arabicName,
            mobile:mobile,
            landPhone:landPhone,
            currency:currency,
            trn:trn,
            tax:tax,
            vat:vat,
            email:email,
            logo:logoURL,
            locationqr:qrcodeURL,        
            termsandconditions:termsandconditions
          }).then(company => {
            return Response.sendSuccessmsg(res,'Company Details Updated')
          })
          .catch(err => {
            return Response.sendFailedmsg(res,'Failed To Update Company Details',err.message)
          })
        }
      }

    

    // if no logo/qrcode in update request
    Company.findOneAndUpdate({_id:req.params.id},{
      name :name,
      address:address,
      arabicName:arabicName,
      mobile:mobile,
      landPhone:landPhone,
      currency:currency,
      trn:trn,
      tax:tax,
      vat:vat,
      email:email,
      logo:logoURL,
      locationqr:qrcodeURL,        
      termsandconditions:termsandconditions
    }).then(company => {
      return Response.sendSuccessmsg(res,'Company Details Updated')
    })
    .catch(err => {
      return Response.sendFailedmsg(res,'Failed To Update Company Details',err.message)
    }) 

  }
  }

  catch(err){
    return Response.sendFailedmsg(res,'Failed To Update Company Details',err.message)
  }

}


exports.deleteCompany = (req, res) => {
     try {

      Company.findOneAndDelete(req.params.id).then((data) =>{
        return Response.sendSuccessmsg(res,'Company Details Deleted')
      })
      .catch(err => {
        return Response.sendFailedmsg(res,'Failed To Delete', err.message)
      })
     }
     catch(err){
       return Response.sendFailedmsg(res,'failed To Delete',err.message)
     }
}
