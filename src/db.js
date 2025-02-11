import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const mongoURI = process.env.MONGO_URI; // ✅ Get MongoDB URI from .env
if (!mongoURI) {
  console.error("❌ MongoDB URI missing in .env");
  process.exit(1);
}

// 🔹 Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/neom_data", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 🔹 Define Sensor Schema
const sensorSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
  temperature: Number,
  timestamp: String,
});

// 🔹 Create Sensor Model
const Sensor = mongoose.model("Sensor", sensorSchema);

export default Sensor;
