module.exports = (app) => {
    const service = require('../Controler/service.controller');

    app.post('/service',service.createService);
    app.get('/service',service.getService);
    app.get('/service/:id',service.getSingleService);
    app.put('/service/:id',service.deleteService);
    app.patch('/service/:id',service.updateService);
    app.post('/service/brand',service.getVarientByBrand);
}
