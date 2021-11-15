module.exports = (app) => {
    const brand = require('../Controler/brand.controller');
    const upload = require('../helper/upload')
    app.post('/brand', brand.createBrand);
    app.post('/image-test',upload.single('image'), brand.testImage);
    app.get('/brand', brand.getBrand);
    app.get('/brand/:id', brand.getSingleBrand);
    app.put('/brand/:id', brand.replaceBrand);
    app.patch('/brand/:id', brand.updateBrand);
}
