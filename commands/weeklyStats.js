const fs = require("fs");
const cron = require("node-cron");

function sendWeeklyStats(bot) {
  // Run the job every Sunday at 9:00 AM
  cron.schedule("0 9 * * 0", () => {
    console.log("⏳ Sending weekly stats...");

    fs.readFile("runs.json", (err, data) => {
      if (err) {
        console.error("Error reading runs file:", err);
        return;
      }

      const runs = JSON.parse(data);
      const lastWeekRuns = runs.filter((run) => {
        const runDate = new Date(run.date);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return runDate >= oneWeekAgo;
      });

      if (lastWeekRuns.length === 0) return;

      // Group runs by user
      const userStats = {};
      lastWeekRuns.forEach((run) => {
        if (!userStats[run.userId]) {
          userStats[run.userId] = {
            totalDistance: 0,
            totalDuration: 0,
            runCount: 0,
          };
        }
        userStats[run.userId].totalDistance += run.distance;
        userStats[run.userId].totalDuration += run.duration;
        userStats[run.userId].runCount++;
      });

      // Send stats to each user
      Object.entries(userStats).forEach(([userId, stats]) => {
        const avgPace = (stats.totalDuration / stats.totalDistance).toFixed(2);
        const message = `
        📅 *Weekly Running Summary:*
        🏃‍♂️ Total Runs: *${stats.runCount}*
        📏 Total Distance: *${stats.totalDistance.toFixed(2)} km*
        ⏳ Total Time: *${stats.totalDuration} minutes*
        ⚡ Average Pace: *${avgPace} min/km*
        Great job! Keep running! 💪🏃‍♂️
                        `;
        bot.sendMessage(userId, message, { parse_mode: "Markdown" });
      });
    });
  });
}

module.exports = { sendWeeklyStats };
