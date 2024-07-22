const { SEND, PDF } = require('../global/_var')

/******** DEPENDENCY  *******/

const express = require('express');
const route = express.Router()

/******** CONTROLLER *******/

const getInfoController = require('../controllers/getInfo.Controller.js')
const saveInfoController = require('../controllers/saveInfo.Controller.js');

/******** ROUTER *********/

route.post(SEND, getInfoController.PolizaDoc)
route.get(PDF,saveInfoController.sendPdf)

module.exports= route