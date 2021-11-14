const express = require("express");

const router = express.Router();
const customerType = require('../Controler/customerTypes.controller');


module.exports = () => {

    router.post('', customerType.createType);

    return router;

}
