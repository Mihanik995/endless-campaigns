const app = require('./src/config/server')
const bot = require('./src/config/telegramBot')

require('dotenv').config();

app.listen(5000, async () => {
    process.env.LOCAL && bot.start();
    console.log(`Server started on port 5000`);
});