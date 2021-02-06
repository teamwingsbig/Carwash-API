module.exports = (app) => {

    const serviceRep = require('../Controler/service_rep.controller')

    app.post('/servicerep', serviceRep.createServiceRep);
    app.get('/servicerep', serviceRep.getServiceRep);
    app.get('/servicerep/:id', serviceRep.getSingleServiceRep);    
    app.put('/servicerep/:id', serviceRep.removeServiceRep);
    app.patch('/servicerep/:id', serviceRep.updateServiceRep);
}