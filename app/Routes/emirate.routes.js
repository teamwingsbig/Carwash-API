module.exports = (app) => {

    const emirate = require('../Controler/emirate.controller')

    app.post('/emirate',emirate.createEmirate)
    app.get('/emirate',emirate.getEmirate)
    app.get('/emirate/:id',emirate.getSingleEmirate)
    app.put('/emirate/:id',emirate.deleteEmirate)
    app.patch('/emirate/:id',emirate.updateEmirate)
}