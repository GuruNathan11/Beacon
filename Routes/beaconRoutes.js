const express = require('express');
const router = express.Router();
const beaconController = require('../Controller/beaconController');

// POST request to start scanning
router.post('/start', beaconController.startScanning);

router.post('/stop',beaconController.stopScanning);
module.exports = router;
