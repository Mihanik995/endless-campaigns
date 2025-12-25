const {Bot} = require('grammy')

require('dotenv').config()

const bot = new Bot('7691622585:AAGjSBFwu9Gc_kflpttmxTEMI5Rig7UHcM0')

bot.api.setWebhook('https://www.endless-campaigns.com/telegram-webhook')
    .then((res: boolean) => console.log(res))
    .catch((err: Error) => console.log(err))
