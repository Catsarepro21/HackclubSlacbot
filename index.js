require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require('axios');

// Initialize the app with Socket Mode enabled
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

// Ping Command
app.command("/rsb-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

// Side Quest Generator
app.command("/rsb-quest", async ({ command, ack, respond }) => {
  await ack();
  try {
    const response = await axios.get('https://bored-api.appbrewery.com/random');
    const { activity, type, participants } = response.data;
    await respond({
      text: `*New Side Quest Acquired!*\n> *Objective:* ${activity}\n> *Category:* ${type} | *Party Size Required:* ${participants}`
    });
  } catch (error) {
    await respond({ 
      text: "Error fetching quest. Your current objective remains: stare into the void and complete your assigned sprint tasks." 
    });
  }
});

// Coinflip Command
app.command("/rsb-coinflip", async ({ command, ack, respond }) => {
  await ack();
  const outcome = Math.random() < 0.5 ? "Heads" : "Tails";
  await respond({ 
    text: `Its: *${outcome}*. Whatchu gonna do now?` 
  });
});

// Countdown Command
app.command("/rsb-countdown", async ({ command, ack, respond }) => {
  await ack();
  const targetDate = new Date(command.text);
  if (isNaN(targetDate)) {
    return await respond({ text: "Please provide a valid date format. E.g., `/rsb-countdown 2026-12-31`" });
  }
  const msLeft = targetDate - Date.now();
  if (msLeft < 0) {
    return await respond({ text: "The deadline has already passed. It's over. Move on." });
  }
  const daysLeft = Math.floor(msLeft / (1000 * 60 * 60 * 24));
  await respond({ 
    text: `There are approximately *${daysLeft} days* left until \`${command.text}\`. Spend them wisely. Or don't.` 
  });
});

// Help Command
app.command("/rsb-help", async ({ command, ack, respond }) => {
  await ack();
  await respond({
    text: [
      "Available commands for this digital construct:",
      "• `/rsb-ping` - Measures the latency.",
      "• `/rsb-quest` - You gotta be really bored ig, heres a quest.",
      "• `/rsb-coinflip` - Coinflip",
      "• `/rsb-countdown [YYYY-MM-DD]` - Days left till that project is due!"
    ].join("\n")
  });
});

// Start the socket connection
(async () => {
  await app.start();
  console.log("bot is running in Socket Mode!");
})();