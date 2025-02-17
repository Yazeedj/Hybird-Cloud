import amqp from "amqplib";
import Sensor from "./db.js"; // Import MongoDB model
import { maskCoordinates, hashTimestamp, encryptData } from "./security.js"; // Import security functions

const RABBITMQ_URL = "amqp://localhost";
const QUEUE_NAME = "sensor_data";

async function publishAnonymizedData() {
  try {
    // 🔹 Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // 🔹 Fetch latest sensor data
    const sensorData = await Sensor.findOne().sort({ timestamp: -1 });

    if (sensorData) {
      // 🔹 Anonymize the data
      const anonymizedData = {
        location: maskCoordinates(sensorData.latitude, sensorData.longitude), // Mask location
        temperature: sensorData.temperature, // Keep temperature as-is
        timestamp: hashTimestamp(sensorData.timestamp) // Hash timestamp
      };

      // 🔹 Encrypt the data before sending
      const encryptedMessage = encryptData(JSON.stringify(anonymizedData));

      channel.sendToQueue(QUEUE_NAME, Buffer.from(encryptedMessage), { persistent: true });
      console.log(`✅ Sent to Queue (Anonymized & Encrypted):`, anonymizedData);
    } else {
      console.log("⚠️ No sensor data available.");
    }

    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("❌ RabbitMQ Producer Error:", err);
  }
}

// 🔹 Run the producer every 5 seconds
setInterval(publishAnonymizedData, 5000);
