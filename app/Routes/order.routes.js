module.exports = (app) => {
    const order = require('../Controler/order.controller.js')

    app.post('/order',order.createOrder);
    app.get('/order',order.getOrders);
    app.get('/order/:id',order.getSingleOrder);
}