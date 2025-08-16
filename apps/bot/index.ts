import { Telegraf, Markup } from 'telegraf';

const BOT_TOKEN = process.env.BOT_TOKEN as string;
if (!BOT_TOKEN) {
    console.error('BOT_TOKEN is missing in environment');
    process.exit(1);
}

// ������ ���� ���� ������� WEB_URL, ���������� �� cloudflared
const WEB_URL = 'https://lawlessly-sovereign-antelope.cloudpub.ru';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
    return ctx.reply(
        'Miner Syndicate � open the Mini App',
        Markup.inlineKeyboard([
            [Markup.button.webApp('Open App', WEB_URL)]
        ])
    );
});

bot.launch().then(() => console.log('Bot is running. Send /start to the bot.'));

// ���������� ����������
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
