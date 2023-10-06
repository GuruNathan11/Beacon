const express = require('express');
const router = express.Router();

const beaconController = require('../Controller/beaconController');

// POST request to start scanning
router.post('/start', beaconController.startScanning);

router.post('/stop',beaconController.stopScanning);

// GET request to fetch all saved beacon data
router.get('/getAllData', beaconController.getAllBeaconData);
module.exports = router;
