import amqp from "amqplib"; // Import amqplib
import { decryptData } from "./security.js"; // Import decryption function

const RABBITMQ_URL = "amqp://localhost"; // RabbitMQ server URL
const QUEUE_NAME = "sensor_data"; // Queue name

async function consumeSensorData() { // Function to consume sensor data
  try {
    // 🔹 Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL); // Connect to RabbitMQ
    const channel = await connection.createChannel(); // Create a channel
    await channel.assertQueue(QUEUE_NAME, { durable: true }); // Assert the queue

    console.log(`✅ Waiting for messages in ${QUEUE_NAME}...`); // Log a message

    // 🔹 Listen for messages
    channel.consume(
      QUEUE_NAME,
      (msg) => {
        if (msg !== null) {
          // 🔹 Decrypt received data
          const decryptedData = decryptData(msg.content.toString());
          const parsedData = JSON.parse(decryptedData);

          console.log(`📩 Received (Decrypted):`, parsedData);
          channel.ack(msg); // Acknowledge the message
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("❌ RabbitMQ Consumer Error:", err);
  }
}

// ✅ Run the consumer function
consumeSensorData();
