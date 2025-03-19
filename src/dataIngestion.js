import { faker } from '@faker-js/faker'; // Use import for ES Modules
import Sensor from "./db.js";  // Ensure correct `.js` extension for ES Modules

// List of IoT device types
const deviceTypes = [
  "Smart TV",
  "Smart Light Bulb",
  "Camera",
  "Smart Door Lock",
  "Smart Speaker",
  "Environmental Sensor",
  "Motion Sensor",
  "Smoke Detector",
  "Smart Thermostat",
  "Smart Security Camera",
  "Smart Plug",
  "Smart Window Blind",
  "Smart Appliance",
  "Smart Air Purifier",
  "Occupancy Sensor",
  "Water Leak Detector",
  "Smart HVAC System",
  "Smart Irrigation System",
  "Connected Entertainment System",
  "Wearable Integration Device"
];

// Function to generate a new sensor data object with device-specific info
function generateData() {
  // Common data for every device
  const commonData = {
    id: faker.string.uuid(),
    deviceType: faker.helpers.arrayElement(deviceTypes),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    timestamp: new Date().toISOString(),
  };

  // Device-specific data based on the device type
  let deviceSpecific = {};

  switch (commonData.deviceType) {
    case "Smart TV":
      deviceSpecific = {
        bluetoothStatus: faker.helpers.arrayElement(["connected", "disconnected"]),
        resolution: faker.helpers.arrayElement(["1080p", "4K", "8K"]),
        activeChannel: faker.lorem.word() // Placeholder for channel information
      };
      break;
    case "Smart Light Bulb":
      deviceSpecific = {
        brightness: faker.number.int({ min: 0, max: 100 }),
        isOn: faker.datatype.boolean(),
        color: faker.color.rgb()
      };
      break;
    case "Camera":
    case "Smart Security Camera":
      deviceSpecific = {
        videoScene: faker.lorem.sentence(),
        motionDetected: faker.datatype.boolean()
      };
      break;
    case "Smart Door Lock":
      deviceSpecific = {
        lockStatus: faker.helpers.arrayElement(["locked", "unlocked"]),
        batteryLevel: faker.number.int({ min: 0, max: 100 })
      };
      break;
    case "Smart Speaker":
      deviceSpecific = {
        volume: faker.number.int({ min: 0, max: 100 }),
        lastVoiceCommand: faker.lorem.words(3)
      };
      break;
    case "Environmental Sensor":
      deviceSpecific = {
        temperature: faker.number.float({ min: -10, max: 50 }),
        humidity: faker.number.int({ min: 0, max: 100 }),
        airQuality: faker.number.int({ min: 0, max: 500 })
      };
      break;
    case "Motion Sensor":
      deviceSpecific = {
        motionDetected: faker.datatype.boolean()
      };
      break;
    case "Smoke Detector":
      deviceSpecific = {
        smokeLevel: faker.number.float({ min: 0, max: 10 }),
        alarm: faker.datatype.boolean()
      };
      break;
    case "Smart Thermostat":
      deviceSpecific = {
        currentTemperature: faker.number.float({ min: -10, max: 50 }),
        setTemperature: faker.number.float({ min: -10, max: 50 })
      };
      break;
    case "Smart Plug":
      deviceSpecific = {
        powerConsumption: faker.number.float({ min: 0, max: 500 }) // in watts
      };
      break;
    case "Smart Window Blind":
      deviceSpecific = {
        position: faker.number.int({ min: 0, max: 100 }) // percentage open
      };
      break;
    case "Smart Appliance":
      deviceSpecific = {
        status: faker.helpers.arrayElement(["on", "off"]),
        usageHours: faker.number.int({ min: 0, max: 24 })
      };
      break;
    case "Smart Air Purifier":
      deviceSpecific = {
        fanSpeed: faker.number.int({ min: 1, max: 5 }),
        airQuality: faker.number.int({ min: 0, max: 500 })
      };
      break;
    case "Occupancy Sensor":
      deviceSpecific = {
        occupancy: faker.datatype.boolean()
      };
      break;
    case "Water Leak Detector":
      deviceSpecific = {
        leakDetected: faker.datatype.boolean(),
        moistureLevel: faker.number.int({ min: 0, max: 100 })
      };
      break;
    case "Smart HVAC System":
      deviceSpecific = {
        mode: faker.helpers.arrayElement(["cooling", "heating", "ventilation"]),
        currentTemperature: faker.number.float({ min: -10, max: 50 })
      };
      break;
    case "Smart Irrigation System":
      deviceSpecific = {
        soilMoisture: faker.number.int({ min: 0, max: 100 }),
        irrigationStatus: faker.helpers.arrayElement(["active", "inactive"])
      };
      break;
    case "Connected Entertainment System":
      deviceSpecific = {
        currentContent: faker.lorem.words(2),
        volume: faker.number.int({ min: 0, max: 100 })
      };
      break;
    case "Wearable Integration Device":
      deviceSpecific = {
        heartRate: faker.number.int({ min: 40, max: 180 }),
        steps: faker.number.int({ min: 0, max: 20000 })
      };
      break;
    default:
      deviceSpecific = {};
  }

  // Return the combined sensor data object
  return { ...commonData, ...deviceSpecific };
}

// Function to generate and store data in MongoDB
async function generateAndStoreData() {
  const data = new Sensor(generateData()); // Create a new Sensor instance

  try {
    await data.save(); // Save to MongoDB
    console.log("✅ Stored in MongoDB:", data);
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}

// Simulate data ingestion every 3.5 seconds
setInterval(generateAndStoreData, 3500);

console.log("🚀 Data ingestion started...");
