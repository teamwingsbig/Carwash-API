const express = require('express');
const router = express.Router();
const vehicleController = require('../Controler/vehicle.controller');

module.exports = function ()  {

    // ********************brand*************************
    router.post('/brand',vehicleController.createBrand);
    router.get('/brand',vehicleController.getBrand);
    router.get('/brand/:id', vehicleController.getSingleBrand);
    router.delete('/brand/:id',vehicleController.deleteBrand);
    router.put('/brand/:id',vehicleController.updateBrand);


    // ********************vehicle*************************

    router.post('/',vehicleController.addVehicle);
    router.get('/',vehicleController.getVehicles);
    router.get('/:id', vehicleController.getVehicleById);
    router.delete('/:id', vehicleController.deleteVehicle);
    router.put('/:id',vehicleController.updateVehicle);


    return router;

}
