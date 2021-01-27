
module.exports = (app) => {
    const brand = require('../Controler/brand.controller');

    app.post('/brand',brand.createBrand);
    app.get('/brand',brand.getBrand);
    app.get('/brand/:id', brand.getSingleBrand);
    app.put('/brand/:id',brand.replaceBrand);
    app.patch('/brand/:id',brand.updateBrand)
}