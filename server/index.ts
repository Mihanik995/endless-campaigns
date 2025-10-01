const {webhookCallback} = require("grammy");
const app = require('./src/config/server')
const bot = require('./src/config/telegramBot')

require('dotenv').config();

if (!process.env.LOCAL) app.use('/telegram-webhook', webhookCallback(bot));

app.listen(5000, async () => {
    console.log(`Server started on port 5000`);
    process.env.LOCAL
        ? bot.start()
        : await bot.api.setWebhook(`${process.env.FRONTED_URL}/telegram-webhook`);
});