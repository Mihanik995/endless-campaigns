const {webhookCallback} = require("grammy");
const app = require('./src/config/server')
const bot = require('./src/config/telegramBot')

require('dotenv').config();

const PORT = process.env.PORT || 5000;
if (!process.env.LOCAL) app.use('/telegram-webhook', webhookCallback(bot));

app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
    process.env.LOCAL
        ? bot.start()
        : await bot.api.setWebhook(`${process.env.FRONTED_URL}/telegram-webhook`);
});