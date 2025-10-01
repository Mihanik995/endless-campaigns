const app = require('./src/config/server')
const bot = require('./src/config/telegramBot')

bot.start()
app.listen(5000, () => {
    console.log("Server started on port 5000");
});