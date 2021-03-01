module.exports = (app) => {
    const order = require('../Controler/order.controller.js')

    app.get('/order/orderDetails',order.getOrderDetails)
    app.post('/order',order.createOrder);
    app.get('/order',order.getOrders);
    app.get('/order/:id',order.getSingleOrder);
    app.post('/order/report',order.orderReport);
}