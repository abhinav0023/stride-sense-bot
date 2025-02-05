import { Telegraf } from 'telegraf'
import { message } from 'telegraf/filters'
// setup dotenv
import dotenv from "dotenv";
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
    const from = ctx.update.message.from;
    ctx.reply(`hi ${from.first_name} welcome to stride sense bot.
        Enter /add_Run to add your runs.
        Enter /view_Stats to view your weekly stats.
        Enter /total_Distance to view your weekly stats.
        `)
  });

// Command to add run 
bot.command('add_Run', (ctx) => {
    ctx.reply('Enter Distance you ran?')
})

// Command to view stats

// Command to view Total Distance

bot.on(message('text'), async (ctx) => {
  console.log(ctx.message);
})

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))