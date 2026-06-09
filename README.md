# Slack Bot for StarDance

A custom Slack bot built for Stardance using Node.js, Slack's Bolt framework, and Socket Mode. Mostly just fun commands.

##  Commands

* `/rsb-ping` - Check the latency between your machine and Slack.
* `/rsb-quest` - Pulls a random side quest from the Bored API when you have writer's block.
* `/rsb-coinflip` - Flips a digital coin to settle arguments instantly.
* `/rsb-countdown [YYYY-MM-DD]` - Counts down the exact number of days left until the deadline.
* `/rsb-help` - Lists everything this construct can do.

## Setup for your own use:
1. Clone Git Repo
2. Run "cd HackclubSlacbot" to enter the repo in terminal
3. Install packages with "npm install @slack/bolt axios dotenv"
4. Create a .env file with your slack creds ex. "SLACK_BOT_TOKEN=xoxb-your-bot-token"
"SLACK_APP_TOKEN=xapp-your-app-token"
5. Run with "node index.js"
