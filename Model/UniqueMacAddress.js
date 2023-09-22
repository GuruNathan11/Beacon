// UniqueMacAddress.js
const mongoose = require('mongoose');

const uniqueMacAddressSchema = new mongoose.Schema({
  mac: String,
  lastSavedTime: Number,
});

const UniqueMacAddress = mongoose.model('UniqueMacAddress', uniqueMacAddressSchema);

module.exports = UniqueMacAddress;
