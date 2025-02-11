import amqp from "amqplib"; // Import amqplib

const RABBITMQ_URL = "amqp://localhost"; // RabbitMQ server URL
const QUEUE_NAME = "sensor_data"; // Queue name

async function consumeSensorData() { // Function to consume sensor data
  try {
    // 🔹 Connect to RabbitMQ
    const connection = await amqp.connect(RABBITMQ_URL); // Connect to RabbitMQ
    const channel = await connection.createChannel();// Create a channel
    await channel.assertQueue(QUEUE_NAME, { durable: true });// Assert the queue

    console.log(`✅ Waiting for messages in ${QUEUE_NAME}...`);// Log a message

    // 🔹 Listen for messages
    channel.consume( // Consume messages wich are sent to the queue!
      QUEUE_NAME,// Queue name
      (msg) => {// Callback function
        if (msg !== null) {// If message is not null
          const data = JSON.parse(msg.content.toString());// Parse the message
          console.log(`📩 Received:`, data);
          channel.ack(msg); // Acknowledge message
        }
      },
      { noAck: false } // Ensure messages are acknowledged
    );
  } catch (err) {
    console.error("❌ RabbitMQ Consumer Error:", err);
  } // Log any errors
}

consumeSensorData();// Call the function to consume sensor data
