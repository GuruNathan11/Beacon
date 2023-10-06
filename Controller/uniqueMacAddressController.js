// // uniqueMacAddressController.js
// const UniqueMacAddress = require('../Model/UniqueMacAddress');

// // Function to add a unique MAC address
// const addUniqueMacAddress = async (req, res) => {
//   try {
//     const { mac } = req.body;

//     // Check if the MAC address already exists
//     const existingMac = await UniqueMacAddress.findOne({ mac }).exec();

//     if (existingMac) {
//       return res.status(400).json({ message: 'MAC address already exists.' });
//     }

//     // Create a new document for the unique MAC address
//     const uniqueMacAddress = new UniqueMacAddress({ mac });

//     // Save the MAC address to the database
//     await uniqueMacAddress.save();

//     res.status(201).json({ message: 'MAC address added successfully.' , mac});
//   } catch (error) {
//     console.error('Error adding MAC address:', error);
//     res.status(500).json({ error: 'Failed to add MAC address.' });
//   }
// };

// module.exports = {
//   addUniqueMacAddress,
// };

const UniqueMacAddress = require('../Model/UniqueMacAddress');

// Function to add a unique MAC address
const addUniqueMacAddress = async (req, res) => {
  try {
    const { mac } = req.body;

    // Check if the MAC address already exists
    const existingMac = await UniqueMacAddress.findOne({ mac }).exec();

    if (existingMac) {
      return res.status(400).json({ message: 'MAC address already exists.' });
    }

    // Create a new document for the unique MAC address
    const uniqueMacAddress = new UniqueMacAddress({ mac });

    // Save the MAC address to the database
    await uniqueMacAddress.save();

    res.status(201).json({ message: 'MAC address added successfully.', mac });
  } catch (error) {
    console.error('Error adding MAC address:', error);
    res.status(500).json({ error: 'Failed to add MAC address.' });
  }
};

// Function to get all saved MAC addresses
const getAllUniqueMacAddresses = async (req, res) => {
  try {
    const macAddresses = await UniqueMacAddress.find().exec();
    res.status(200).json(macAddresses);
  } catch (error) {
    console.error('Error getting MAC addresses:', error);
    res.status(500).json({ error: 'Failed to get MAC addresses.' });
  }
};

module.exports = {
  addUniqueMacAddress,
  getAllUniqueMacAddresses, // Add this line to export the new function
};
