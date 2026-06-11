require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require('axios');

// Initialize the app with Socket Mode
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// --- Existing Commands ---

app.command("/rsb-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  await respond({ text: `Pong!\nLatency: ${Date.now() - start}ms` });
});

app.command("/rsb-quest", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get('https://bored-api.appbrewery.com/random');
    const { activity, type, participants } = response.data;
    await respond({ text: `*New Side Quest Acquired!*\n> *Objective:* ${activity}\n> *Category:* ${type} | *Party Size:* ${participants}` });
  } catch (err) {
    console.error(`[ERROR] Quest failed: ${err.message}`);
    await respond({ text: "Error fetching quest. Stare into the void instead." });
  }
});

app.command("/rsb-coinflip", async ({ ack, respond }) => {
  await ack();
  await respond({ text: `It's: *${Math.random() < 0.5 ? "Heads" : "Tails"}*. Happy?` });
});

app.command("/rsb-countdown", async ({ command, ack, respond }) => {
  await ack();
  const targetDate = new Date(command.text);
  if (isNaN(targetDate)) return await respond({ text: "Invalid date format. Use YYYY-MM-DD." });
  const msLeft = targetDate - Date.now();
  if (msLeft < 0) return await respond({ text: "The deadline is gone. Stop clinging to the past." });
  await respond({ text: `Only ${Math.floor(msLeft / (1000 * 60 * 60 * 24))} days left. Tick tock.` });
});

// --- AI Integration with Debug Logging ---

app.message(async ({ message, say }) => {
  // Ignore bots and empty messages
  if (message.subtype === 'bot_message' || !message.text) return;

  console.log(`[INFO] Received message from ${message.user}: "${message.text}"`);

  try {
    console.log(`[PROCESS] Sending prompt to Qwen2:0.5b...`);
    const start = Date.now();

    const response = await axios.post('http://127.0.0.1:11434/api/generate', {
      model: 'qwen2:0.5b',
      prompt: message.text,
      stream: false
    });

    const duration = Date.now() - start;
    console.log(`[SUCCESS] AI responded in ${duration}ms.`);

    await say(response.data.response || "The AI is speechless.");
  } catch (err) {
    console.error(`[ERROR] Ollama connection failed: ${err.message}`);
    await say("Ollama is down. Even the AI needs a nap sometimes.");
  }
});

// --- Startup ---

(async () => {
  await app.start();
  console.log("Bot is running. Ready to process your requests.");
})();
