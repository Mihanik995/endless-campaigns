const {webhookCallback} = require("grammy");
const app = require('./src/config/server')
const bot = require('./src/config/telegramBot')

require('dotenv').config();

if (!process.env.LOCAL) app.use('/telegram-webhook', webhookCallback(bot));
console.log(process.env.FRONTED_URL)

app.listen(5000, async () => {
    process.env.LOCAL && await bot.start();
    console.log(`Server started on port 5000`);
});