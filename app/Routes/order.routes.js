module.exports = (app) => {
    const order = require('../Controler/order.controller.js')

    app.post('/order/reportByService',order.reportByService)
    app.get('/order/searchbyvehiclenumber',order.searchByVehicleNumber)
    app.get('/order/searchcustomer',order.searchByMobile)
    app.get('/order/orderDetails',order.getOrderDetails)
    app.get('/order/recentOrders',order.getRecentOrders)
    app.get('/order/dailygross',order.dailyGross)
    app.get('/order/monthlygross',order.monthlyGross)
    app.post('/order',order.createOrder);
    app.get('/order',order.getOrders);
    app.get('/order/:id',order.getSingleOrder);
    app.post('/order/report',order.orderReport);
    app.put('/order/updateorder/:id',order.updateOrder)
    app.patch('/order/deleteorder/:id',order.deleteOrder)
    

}
