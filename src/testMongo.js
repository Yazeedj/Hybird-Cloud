const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = MONGO_URI="mongodb+srv://pnsw123123:FMI1FD7WUOJGFY61@cloudproject.txhts.mongodb.net/?retryWrites=true&w=majority&appName=CloudProject"


// Create a MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect(); // Connect to MongoDB
    await client.db("admin").command({ ping: 1 }); // Send a ping
    console.log("✅ Successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  } finally {
    await client.close(); // Close the connection
  }
}

run();
