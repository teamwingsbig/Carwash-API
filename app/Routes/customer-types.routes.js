const express = require("express");

const router = express.Router();
const customerType = require('../Controler/customerTypes.controller');


module.exports = () => {

    router.post('', customerType.createType);
    router.get('/',customerType.getCustomerType);
    router.get('/:id', customerType.getSingleType);
    router.patch('/:id',customerType.deleteType);
    router.put('/:id',customerType.updateType);

    return router;

}
