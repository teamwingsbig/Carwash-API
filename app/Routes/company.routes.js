module.exports = (app) => {
    const company = require('../Controler/company.controller.js');
    const {loadFile}    = require('../helper/upload-conf')

    app.post('/company',company.createCompany);
    app.get('/company',company.getCompany);
    app.get('/company/:id',company.getSingleCompany);
    app.patch('/company/:id',company.updateCompany);
    app.delete('/company/:id',company.deleteCompany);

}