import express from "express"; // Loads Express for handling API requests.
import dotenv from "dotenv"; // dotenv to load settings (like database credentials).
import cors from "cors"; // Enables CORS to allow external apps to access your API.
import amqp from "amqplib"; // ✅ Import RabbitMQ
import Sensor from "./db.js"; // Import MongoDB model

dotenv.config(); // Load environment variables

// RabbitMQ Config
const RABBITMQ_URL = "amqp://localhost"; // RabbitMQ server URL
const QUEUE_NAME = "sensor_data"; // Queue name

// Set Up Express Server
const app = express(); // Creates an Express server (app).
app.use(express.json()); // Enables JSON parsing for incoming requests.
app.use(cors()); // Ensures the API is accessible from different domains.

// ✅ POST /data – Store sensor data & Send to RabbitMQ
app.post("/data", async (req, res) => {
  try {
    const { latitude, longitude, temperature, timestamp } = req.body;

    if (!latitude || !longitude || !temperature || !timestamp) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Store in MongoDB
    const newSensorData = new Sensor({ latitude, longitude, temperature, timestamp });
    await newSensorData.save();

    // ✅ Send data to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    const message = JSON.stringify(newSensorData);
    channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });

    console.log(`📩 Sent to Queue: ${message}`);

    setTimeout(() => {
      connection.close();
    }, 500);

    res.status(201).json({ message: "✅ Data stored & sent to RabbitMQ!" });
  } catch (err) {
    console.error("❌ Error storing data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ GET /data – Retrieve Last 10 Data Entries from MongoDB
app.get("/data", async (req, res) => {
  try {
    console.log("📢 Fetching last 10 sensor entries...");

    const result = await Sensor.find().sort({ timestamp: -1 }).limit(10); // Fetch latest 10 entries

    console.log("✅ Data fetched:", result);
    res.json(result);
  } catch (err) {
    console.error("❌ Error retrieving data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
