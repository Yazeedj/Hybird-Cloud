import express from "express";

const app = express();
app.use(express.json());

const PORT = process.env.CLOUD_PORT || 4000;

// ✅ Mock Cloud API - Receives anonymized data
app.post("/receive-data", (req, res) => {
  console.log("📩 Cloud Received:", req.body);
  res.json({ status: "✅ Data received by cloud" });
});

app.listen(PORT, () => {
  console.log(`☁️ Mock Cloud running on port ${PORT}`);
});
