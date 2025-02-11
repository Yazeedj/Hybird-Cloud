import { faker } from '@faker-js/faker'; // Use import for ES Modules
import Sensor from "./db.js";  // Ensure correct `.js` extension for ES Modules

// Function to generate a new sensor data object
function generateData() {
  return {
    id: faker.string.uuid(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    temperature: faker.number.float({ min: -10, max: 50 }),
    humidity: faker.number.int({ min: 0, max: 100 }),
    pressure: faker.number.int({ min: 900, max: 1100 }),
    noise_level: faker.number.int({ min: 30, max: 100 }),
    timestamp: new Date().toISOString(),


  };
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
