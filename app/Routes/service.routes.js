module.exports = (app) => {
    const service = require('../Controler/service.controller');

    app.post('/service',service.createService);
}
