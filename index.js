import admin from "firebase-admin";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";

// Firebase Service Account key (serviceAccountKey.json)
const serviceAccount = JSON.parse(fs.readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://siyamhasansiyam-2c149-default-rtdb.firebaseio.com"
});

const db = admin.database();

// Telegram Bot Setup
const token = "7860488783:AAGcAs1wJJXnb2Q0bcUNHi1CJZuXRJvSoKI";
const chatId = "7465244567"; // আপনার Telegram ID
const bot = new TelegramBot(token, { polling: false });

// users নোডে লিসেনার
const ref = db.ref("users");

// নতুন ইউজার যোগ হলে
ref.on("child_added", snapshot => {
  const mobile = snapshot.key;
  const data = snapshot.val();

  for (const [key, value] of Object.entries(data)) {
    const msg = `📱 Mobile: ${mobile}\n${key}: ${value}`;
    bot.sendMessage(chatId, msg);
  }
});

// users এর ভিতরে নতুন field বা update হলে
ref.on("child_changed", snapshot => {
  const mobile = snapshot.key;
  const data = snapshot.val();

  for (const [key, value] of Object.entries(data)) {
    const msg = `📱 Mobile: ${mobile}\n${key}: ${value}`;
    bot.sendMessage(chatId, msg);
  }
});

console.log("✅ Firebase → Telegram service চলছে...");