const fs = require('fs');
const userSessions = {};
function logRunCommand(bot) {
    bot.onText(/\/logrun/, (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, "🏃 How many kilometers did you run? (e.g., 5.2)").then(() => {
            userSessions[chatId] = { step: "distance", userId: chatId, date: new Date().toISOString() };
        });
    });

    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        if (!userSessions[chatId]) return;

        const userInput = msg.text.trim();
        if (userSessions[chatId].step === "distance") {
            if (isNaN(userInput)) {
                return bot.sendMessage(chatId, "❌ Please enter a valid number for distance.");
            }
            userSessions[chatId].distance = parseFloat(userInput);
            userSessions[chatId].step = "duration";
            return bot.sendMessage(chatId, "⏳ How long did you run? (in minutes, e.g., 30)");
        }

        if (userSessions[chatId].step === "duration") {
            if (isNaN(userInput)) {
                return bot.sendMessage(chatId, "❌ Please enter a valid number for duration.");
            }

            userSessions[chatId].duration = parseInt(userInput);
            const runData = userSessions[chatId];
            delete userSessions[chatId];

            // Save to file
            fs.readFile('runs.json', (err, data) => {
                let runs = [];
                if (!err) {
                    runs = JSON.parse(data);
                }
                runs.push(runData);
                fs.writeFile('runs.json', JSON.stringify(runs, null, 2), (err) => {
                    if (err) console.error("Error saving run data:", err);
                });
            });

            return bot.sendMessage(
                chatId, 
                `✅ Run logged! You ran *${runData.distance} km* in *${runData.duration} minutes*.`,
                { parse_mode: "Markdown" }
            );
        }
    });
}

module.exports = { logRunCommand };
