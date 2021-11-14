const upload = require('../helper/upload')

module.exports = (app) => {
    const order = require('../Controler/order.controller.js')
    app.get('/order/report', order.orderReport);
    app.get('/order/vehicle/report', order.orderVehicleReport);
    app.get('/order/filteredrecentorders', order.getFilteredRecentOrders)
    app.post('/order/reportByService', order.reportByService)
    app.get('/order/searchcustomer', order.searchCustomer)
    app.get('/order/orderDetails', order.getOrderDetails)
    app.get('/order/dashboard/counts', order.getDashboardCounts)
    app.get('/order/recentOrders', order.getRecentOrders)
    app.get('/order/dailygross', order.dailyGross)
    // app.get('/order/monthlygross',order.monthlyGross)
    app.post('/order',upload.array('images', 12), order.createOrder);
    app.get('/order', order.getOrders);
    app.get('/order/:id', order.getSingleOrder);
    app.put('/order/updateorder/:id', order.updateOrder)
    app.patch('/order/deleteorder/:id', order.deleteOrder)


}
