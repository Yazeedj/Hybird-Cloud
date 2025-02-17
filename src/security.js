import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.SECRET_KEY) {
  throw new Error("❌ SECRET_KEY is missing. Check your .env file.");
}


// 🔹 Mask latitude & longitude (Reduce decimal precision)
function maskCoordinates(latitude, longitude) {
  return {
    latitude: parseFloat(latitude.toFixed(3)), // Keep only 3 decimal places
    longitude: parseFloat(longitude.toFixed(3))
  };
}

// 🔹 Hash timestamps (Using SHA-256 for irreversible hashing)
function hashTimestamp(timestamp) {
  return crypto.createHash("sha256").update(timestamp).digest("hex");
}

// 🔹 Encrypt sensitive data using AES-256
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, "hex"); // Ensure it's always 32 bytes
const IV_LENGTH = 16; // AES IV should always be 16 bytes

function encryptData(data) {
  const iv = crypto.randomBytes(IV_LENGTH); // Generate a unique IV
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);

  let encrypted = cipher.update(data, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted; // Store IV and encrypted message together
}

// 🔹 Decrypt AES-256 encrypted data
function decryptData(encryptedData) {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex"); // Extract IV
    const encryptedText = parts[1];

    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    return decrypted;
  } catch (error) {
    console.error("❌ Decryption failed:", error.message);
    return null;
  }
}

// ✅ Ensure `hashTimestamp` is exported
export { maskCoordinates, hashTimestamp, encryptData, decryptData };
 