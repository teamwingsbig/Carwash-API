const Service = require('../Models/service.model');

exports.createService = (req, res) => {

   
    const sub_service =  req.body.sub_services

   
    const sub_serviceArray = [];
    const varientArray = [];
   
    sub_service.forEach(element => {
         
        for(i of element.varients){
            varientArray.push(element.varients)
        }
        console.log(varientArray)

        sub_serviceArray.push({
            name:element.name,
            brand_id:element.brand_id,
            varients:varientArray
            
            
        })
       
    });

    const postArray = new Service({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        sub_services:sub_serviceArray
       
    })




    console.log(postArray);
    // console.log(title,description,type)

}


exports.getService = (req, res) => {
    res.send("Worked")
}

