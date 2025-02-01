
function startCommand(bot){
    bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    
    const welcomeMessage = `
Hello, ${msg.from.first_name}! 🚀 Welcome to *Stride Sense*.

Here are the features of this bot:
📌 *Track your runs* - Log and view your running sessions.
📊 *View statistics* - Get insights on distance, pace, and performance.

Use the commands below to get started:
🔹 /logrun - Add a new running session
🔹 /viewstats - See your running stats
Happy running! 🏃‍♂️💨
`;
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});

}

// Export the startCommand function
module.exports = {startCommand};
