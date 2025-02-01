const fs = require("fs");

function viewStatsCommand(bot) {
  bot.onText(/\/viewstats/, (msg) => {
    const chatId = msg.chat.id;

    // Read the runs.json file
    fs.readFile("runs.json", (err, data) => {
      if (err) {
        if (err.code === "ENOENT") {
          return bot.sendMessage(
            chatId,
            "📂 No running data found yet. Log your runs using /logrun."
          );
        }
        console.error("Error reading file:", err);
        return bot.sendMessage(
          chatId,
          "⚠️ An error occurred while fetching stats."
        );
      }

      let runs = JSON.parse(data);

      if (runs.length === 0) {
        return bot.sendMessage(
          chatId,
          "📂 No running data found yet. Log your runs using /logrun."
        );
      }

      // Calculate stats
      const totalRuns = runs.length;
      const totalDistance = runs.reduce((sum, run) => sum + run.distance, 0);
      const totalDuration = runs.reduce((sum, run) => sum + run.duration, 0);
      const avgPace = totalDuration / totalDistance; // Minutes per km

      // Create message with stats
      const statsMessage = `
        📊 *Your Running Stats:*
        🏃‍♂️ Total Runs: *${totalRuns}*
        📏 Total Distance: *${totalDistance.toFixed(2)} km*
        ⏳ Total Time: *${totalDuration} minutes*
        ⚡ Average Pace: *${avgPace.toFixed(2)} min/km*
                    `;

      bot.sendMessage(chatId, statsMessage, { parse_mode: "Markdown" });
    });
  });
}

module.exports = { viewStatsCommand };
