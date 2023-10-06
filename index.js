const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const beaconRoutes = require('./Routes/beaconRoutes');
const uniqueMacAddressRoutes = require('./Routes/uniqueMacAddressRoutes'); // Import the uniqueMacAddressRoutes
const cors = require('cors');
const app = express();
const port = process.env.PORT || 7000;

const mongo= mongoose.connect('mongodb+srv://Gurunathan:Gurunathan11@cluster0.aeeridr.mongodb.net/beaconData', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 mongo.then(()=>{console.log("Connected...")}, error => {console.log("Error",error)})

 app.use(cors());
app.use(bodyParser.json());

app.use('/api/beacon', beaconRoutes);
app.use('/api/macAddress', uniqueMacAddressRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
