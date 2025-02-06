import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
import { Run } from './src/models/runs.js';
import { User } from './src/models/users.js';
import connectDb from './db.js';

// setup dotenv
import dotenv from "dotenv";
dotenv.config();

const userSessions = new Map();

// connect to database
try {
  connectDb();
} catch (e) {
  console.log(e);
  process.kill(process.pid, "SIGTERM");
}


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
  const from = ctx.update.message.from;
  console.log(from);
  // Check if user already exists in the database, if not, insert new user record.
  try {
    await User.findOneAndUpdate(
      { tgId: from.id },
      {
        $setOnInsert: {
          firstName: from.first_name,
          lastName: from.last_name || "",
          username: from.username || "",
          isBot: from.is_bot,
          tgId: from.id,
        },
      },
      { upsert: true, new: true }
    );
    await ctx.reply(`🏃♂️ Welcome ${from.first_name} to Stride Sense!
      /add_Run - Add your runs
      /view_Stats - View weekly stats
      /total_Distance - Total weekly distance`);
  } catch (err) {
    console.log(err);
    await ctx.reply(
      "Error occurred while storing user data. Please try again later."
    );
  }
});

// Command to add run 
bot.command('add_Run', async (ctx) => {
  const userId = ctx.message.from.id;
  userSessions.set(userId, { action: 'awaiting_distance' });
  ctx.reply('📏 Please enter the distance you ran in kilometers:');
});

// Handle distance input
bot.command('add_Run', async (ctx) => {
  const userId = ctx.message.from.id;
  userSessions.set(userId, { action: 'awaiting_distance' });
  ctx.reply('📏 Please enter the distance you ran in kilometers:');
});

// Handle distance input
bot.on(message('text'), async (ctx) => {
  const userId = ctx.message.from.id;
  const session = userSessions.get(userId);

  try {
    if (session && session.action === 'awaiting_distance') {
      const distance = parseFloat(ctx.message.text);
      if (isNaN(distance)) {
        ctx.reply('❌ Please enter a valid number');
        return;
      }

      // Find user
      const user = await User.findOne({ tgId: userId });
      if (!user) {  
        ctx.reply('❌ User not found. Please send /start first.');
        return;
      }

      // Create new run
      const newRun = new Run({
        distance,
        userId: user._id
      });
      
      await newRun.save();
      user.runs.push(newRun._id);
      await user.save();

      ctx.reply(`✅ Successfully logged ${distance}km run!`);
      userSessions.delete(userId);
    }
  } catch (error) {
    console.error('Error saving run:', error);
    ctx.reply('❌ Error saving your run. Please try again.');
  }
});
// Command to view stats

// Command to view Total Distance

bot.on(message('text'), async (ctx) => {
  console.log(ctx.message);
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))