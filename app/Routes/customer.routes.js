module.exports = (app)=>{
    const customer = require('../Controler/customer.controller');

    app.post('/customer',customer.createCustomer);
    app.get('/customer',customer.getCustomer);
    app.get('/customer/:id',customer.getSingleCustomer);
    app.patch('/customer/:id',customer.updateCustomer);
    app.put('/customer/:id',customer.deleteCustomer);
}