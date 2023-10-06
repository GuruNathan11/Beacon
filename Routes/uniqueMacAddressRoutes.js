// uniqueMacAddressRoutes.js
const express = require('express');
const router = express.Router();
const uniqueMacAddressController = require('../Controller/uniqueMacAddressController');

// POST request to add a unique MAC address
router.post('/add', uniqueMacAddressController.addUniqueMacAddress);
router.get('/getAll', uniqueMacAddressController.getAllUniqueMacAddresses);
module.exports = router;
