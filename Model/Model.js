const mongoose = require('mongoose');

const beaconDataSchema = new mongoose.Schema({
  uuid: String,
  major: Number,
  minor: Number,
  rssi: Number,
  mac: String,
  localTime: Date,
});

const BeaconData = mongoose.model('BeaconData', beaconDataSchema);

module.exports = BeaconData;
