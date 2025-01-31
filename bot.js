require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Load bot token from .env file
const token = process.env.BOT_TOKEN;

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

console.log('🚀 Bot is running...');

// Handle "/start" command
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Hello, ${msg.from.first_name}! 🚀 Welcome to Stride Monitor.`);
});

// Handle file upload command
bot.onText(/\/sendfile/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendDocument(chatId, './sample.pdf', { caption: "Here's your file 📂" });
});

// Handle all text messages
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (!msg.text.startsWith('/')) {
        bot.sendMessage(chatId, `You said: "${msg.text}"`);
    }
});
