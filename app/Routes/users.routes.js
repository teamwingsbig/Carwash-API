module.exports =(app) => {
    const user = require('../Controler/users.controller')

    app.post('/users',user.createAdmin)
    app.post('/users/authentication',user.authentication)
    app.get('/users',user.getUsers)

}