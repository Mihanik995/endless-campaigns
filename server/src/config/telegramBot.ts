import {type Context, type SessionFlavor} from 'grammy'

const {Bot, InlineKeyboard, webhookCallback, session} = require('grammy')
const app = require('./server')

require('dotenv').config()

const bot = new Bot(process.env.TELEGRAM_API_KEY)

interface SessionData {
    step: null;
}

type BotContext = Context & SessionFlavor<SessionData>

if (!process.env.LOCAL) app.use('/telegram-webhook', webhookCallback(bot));

bot.use(session({initial: () => ({step: null})}));

bot.command('start', async (ctx: BotContext) => {
    await ctx.reply(`Hello ${ctx.from?.first_name}! How can I help you?`, {
        reply_markup: new InlineKeyboard().text('📝 Register', 'register'),
    });
});

bot.callbackQuery('register', async (ctx: BotContext) => {
    if (ctx.from?.id) await ctx.reply(`ID of this chat is ${ctx.from.id}. ` +
        'You can add it to your profile (https://www.endless-campaigns.com/profile). ' +
        'Once you do, you\'ll receive notifications about any changes.')
});

module.exports = bot