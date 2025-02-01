require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { startCommand } = require("./commands/start");
const { logRunCommand } = require("./commands/logrun");
const { viewStatsCommand } = require('./commands/viewStats');
const { sendWeeklyStats } = require('./commands/weeklyStats');

// Load bot token from .env file
const token = process.env.BOT_TOKEN;

// Create bot instance
const bot = new TelegramBot(token, { polling: true });
console.log("running");
// call commands
startCommand(bot);
logRunCommand(bot);
viewStatsCommand(bot);
sendWeeklyStats(bot);
bot.on("polling_error", console.log);