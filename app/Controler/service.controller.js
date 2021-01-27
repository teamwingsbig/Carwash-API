const Service = require('../Models/service.model');

exports.createService = (req, res) => {


    const sub_service = req.body.sub_services


    const sub_serviceArray = [];
    const varientArray = [];

    for (const service of sub_service) {
        for (const varients of service.varients) {
            varientArray.push(varients)
        }
        sub_serviceArray.push({
            name: service.name,
            brand_id: service.brand_id,
            varients: varientArray
        })

    }
    const service = new Service({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        sub_services: (sub_serviceArray)
    });


    console.log(service)
    res.send(service)
    // console.log(title,description,type)

}


exports.getService = (req, res) => {
    res.send("Worked")
}

