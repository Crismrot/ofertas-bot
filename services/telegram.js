require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const channelId = process.env.TELEGRAM_CHANNEL_ID;

const bot = new TelegramBot(token, { polling: false });

async function sendMessage(text) {
  try {
    await bot.sendMessage(channelId, text, { parse_mode: 'Markdown' });
    console.log('📨 Mensaje enviado al canal');
  } catch (err) {
    console.error('❌ Error al enviar mensaje:', err.message);
  }
}

module.exports = { sendMessage };
