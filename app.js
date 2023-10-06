const noble = require('noble'); // Bluetooth LE library
const speaker = require('node-speaker'); // For playing the alarm sound

// Initialize Bluetooth LE
noble.on('stateChange', (state) => {
  if (state === 'poweredOn') {
    noble.startScanning(); // Start scanning for BLE devices
  } else {
    noble.stopScanning(); // Stop scanning if Bluetooth is not powered on
  }
});

// Listen for discovered devices
noble.on('discover', (peripheral) => {
  // Check if the discovered device is your B7 Button Wristband
  if (peripheral.advertisement.localName === 'B7ButtonWristband') {
    // Connect to the wristband
    peripheral.connect((error) => {
      if (!error) {
        console.log('Connected to B7 Button Wristband');
        // Listen for button press events
        peripheral.discoverServices(['your_button_service_uuid'], (error, services) => {
          if (!error && services.length > 0) {
            const buttonService = services[0];
            buttonService.discoverCharacteristics(['your_button_characteristic_uuid'], (error, characteristics) => {
              if (!error && characteristics.length > 0) {
                const buttonCharacteristic = characteristics[0];
                // Handle button press events
                buttonCharacteristic.on('data', (data, isNotification) => {
                  if (isNotification && data.readUInt8(0) === 1) {
                    console.log('SOS button pressed');
                    // Trigger alarm sound
                    const alarmSound = new speaker();
                    alarmSound.write(your_alarm_audio_data); // Replace with actual audio data
                  }
                });

                // Enable notifications for the button characteristic
                buttonCharacteristic.subscribe();
              }
            });
          }
        });
      } else {
        console.error('Error connecting to B7 Button Wristband:', error);
      }
    });
  }
});
