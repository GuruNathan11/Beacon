// const BeaconScanner = require('node-beacon-scanner');
// const BeaconData = require('../Model/Model.js');

// const scanner = new BeaconScanner();

// // Define the RSSI threshold for 2 meters
// const rangeThreshold = -40; // Adjust this value based on your specific needs

// scanner.onadvertisement = (ad) => {
//   if (ad.beaconType === 'iBeacon') {
//     const uuid = ad.iBeacon.uuid;
//     const major = ad.iBeacon.major;
//     const minor = ad.iBeacon.minor;
//     const rssi = ad.rssi;
//     const mac = ad.address;
//     const localTime = new Date(); // Capture the local time

//     if (rssi >= rangeThreshold) {
//       // Create a data object to insert into MongoDB
//       const beaconData = new BeaconData({
//         uuid,
//         major,
//         minor,
//         rssi,
//         mac,
//         localTime,
//       });

//       // Save the data to MongoDB
//       beaconData.save()
//         .then(() => {
//           console.log('Beacon data saved to MongoDB');
//         })
//         .catch((error) => {
//           console.error('Error saving beacon data:', error);
//         });

//       // Rest of your logic...
//     } else {
//       console.log(`Beacon with MAC ${mac} is out of range.`);
//     }
//   }
// };

// scanner.startScan().then(() => {
//   console.log('Scanning for iBeacons...');
// }).catch((error) => {
//   console.error('Error starting scanning:', error);
// });

// module.exports = {
//   // You can export other functions or middleware as needed
// };



//Latest working Code::

// const BeaconScanner = require('node-beacon-scanner');
// const BeaconData = require('../Model/Model.js');

// const scanner = new BeaconScanner();

// // Define the RSSI threshold for 2 meters
// const rangeThreshold = -100; // Adjust this value based on your specific needs

// let scanning = false; // Flag to track scanning status

// scanner.onadvertisement = (ad) => {
//   if (scanning && ad.beaconType === 'iBeacon') {
//     const uuid = ad.iBeacon.uuid;
//     const major = ad.iBeacon.major;
//     const minor = ad.iBeacon.minor;
//     const rssi = ad.rssi;
//     const mac = ad.address;
//     const localTime = new Date(); // Capture the local time

//     if (rssi >= rangeThreshold) {
//       // Create a data object to insert into MongoDB
//       const beaconData = new BeaconData({
//         uuid,
//         major,
//         minor,
//         rssi,
//         mac,
//         localTime,
//       });

//       // Save the data to MongoDB
//       beaconData.save()
//         .then(() => {
//           console.log('Beacon data saved to MongoDB');
//         })
//         .catch((error) => {
//           console.error('Error saving beacon data:', error);
//         });

//       // Rest of your logic...
//     } else {
//       console.log(`Beacon with MAC ${mac} is out of range.`);
//     }
//   }
// };

// // Function to start scanning
// const startScanning = (req, res) => {
//   if (scanning) {
//     return res.status(400).json({ message: 'Scanning is already in progress.' });
//   }

//   scanning = true;
//   scanner.startScan()
//     .then(() => {
//       console.log('Scanning for iBeacons...');
//       res.status(200).json({ message: 'Scanning started.' });
//     })
//     .catch((error) => {
//       scanning = false;
//       console.error('Error starting scanning:', error);
//       res.status(500).json({ error: 'Failed to start scanning.' });
//     });
// };
// // Function to stop scanning
// const stopScanning = (req, res) => {
//     if (!scanning) {
//       return res.status(400).json({ message: 'Scanning is not in progress.' });
//     }
  
//     scanning = false;
//     scanner.stopScan()

//      console.log("Stop scanning...")
//         res.status(200).json({ message: 'Scanning stopped.' });
   
//   }
  
//   module.exports = {
//     startScanning,
//     stopScanning,
//     // You can export other functions or middleware as needed
//   }; 


const BeaconScanner = require('node-beacon-scanner');
const BeaconData = require('../Model/Model.js');
const UniqueMacAddress = require('../Model/UniqueMacAddress.js'); // Import your UniqueMacAddress model

const scanner = new BeaconScanner();

// Define the RSSI threshold for 2 meters
const rangeThreshold = -100; // Adjust this value based on your specific needs

let scanning = false; // Flag to track scanning status

scanner.onadvertisement = async (ad) => {
  if (scanning && ad.beaconType === 'iBeacon') {
    const uuid = ad.iBeacon.uuid;
    const major = ad.iBeacon.major;
    const minor = ad.iBeacon.minor;
    const rssi = ad.rssi;
    const mac = ad.address;
    const localTime = new Date(); // Capture the local time

    if (rssi >= rangeThreshold) {
      try {
        // Check if the MAC address exists in the UniqueMacAddress collection
        const uniqueMac = await UniqueMacAddress.findOne({ mac }).exec();

        if (uniqueMac) {
          // Check if the MAC address was saved more than a minute ago
          const lastSavedTime = uniqueMac.lastSavedTime || 0;
          const currentTime = Date.now();

          if (!lastSavedTime || currentTime - lastSavedTime >= 60000) {
            // Create a data object to insert into MongoDB
            const beaconData = new BeaconData({
              uuid,
              major,
              minor,
              rssi,
              mac,
              localTime,
            });

            // Save the data to MongoDB
            await beaconData.save();

            // Update the lastSavedTime in the UniqueMacAddress collection
            await UniqueMacAddress.updateOne({ mac }, { lastSavedTime: currentTime }).exec();

            console.log('Beacon data saved to MongoDB');
          } else {
            console.log(`Beacon with MAC ${mac} has already been saved within the last minute.`);
          }
        } else {
          console.log(`Beacon with MAC ${mac} is not in the list of unique MAC addresses.`);
        }
      } catch (error) {
        console.error('Error saving beacon data:', error);
      }
    } else {
      console.log(`Beacon with MAC ${mac} is out of range.`);
    }
  }
};

// Function to start scanning
const startScanning = (req, res) => {
  if (scanning) {
    return res.status(400).json({ message: 'Scanning is already in progress.' });
  }

  scanning = true;
  scanner.startScan()
    .then(() => {
      console.log('Scanning for iBeacons...');
      res.status(200).json({ message: 'Scanning started.' });
    })
    .catch((error) => {
      scanning = false;
      console.error('Error starting scanning:', error);
      res.status(500).json({ error: 'Failed to start scanning.' });
    });
};

// Function to stop scanning
const stopScanning = (req, res) => {
  if (!scanning) {
    return res.status(400).json({ message: 'Scanning is not in progress.' });
  }

  scanning = false;
  scanner.stopScan();

  console.log('Stop scanning...');
  res.status(200).json({ message: 'Scanning stopped.' });
};

module.exports = {
  startScanning,
  stopScanning,
  // You can export other functions or middleware as needed
};

