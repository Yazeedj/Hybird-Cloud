import amqp from "amqplib";
import Sensor from "./db.js"; // Import MongoDB model

const RABBITMQ_URL = "amqp://localhost"; // RabbitMQ server URL
const QUEUE_NAME = "sensor_data"; // Queue name

async function publishSensorData() {
  try {
    // 🔹 Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    // 🔹 Fetch the latest sensor data from MongoDB
    const sensorData = await Sensor.findOne().sort({ timestamp: -1 }); // Fetch the latest entry

    if (sensorData) { // If data is available
      const message = JSON.stringify(sensorData); // Convert to JSON string
      channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true }); // Send to Queue
      console.log(`✅ Sent to Queue from Producer ${message}`); // Log the message
    } else {
      console.log("⚠️ No sensor data available."); // Log if no data is available
    }

    // 🔹 Close connection after sending
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.error("❌ RabbitMQ Producer Error:", err);
  }
}

// 🔹 Run the producer every 5 seconds
setInterval(publishSensorData, 5000);
