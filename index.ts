import config from './config/auth';
import * as Discord from 'discord.js';
import MessagesController from './src/controllers/MessagesController';
import AppError from './src/errors/AppError';

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

client.on('message', async msg => {

    try {

        if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

        const data = await MessagesController.handleMessage(msg.content);

        if(typeof data === typeof 'string') {
            msg.channel.send(data);
            return;
        }

        msg.channel.send(`\`\`\`json\n${JSON.stringify(data, undefined, 4)}\`\`\``);
    } catch (e) {
        if (e instanceof AppError) {
            msg.reply(`${e.message}`);
        } else {
            msg.channel.send(`Unknown error during command execution: **${e.message}**`)
        }
    }
});

client.on('messageUpdate', async msg => {

    try {
        const updatedContent = msg.channel.messages.cache.first().content;

        if (!updatedContent.startsWith(config.prefix) || msg.author.bot) return;

        const data = await MessagesController.handleMessage(updatedContent);

        msg.channel.send(`\`\`\`${JSON.stringify(data)}\`\`\``);

    } catch (e) {
        if (e instanceof AppError) {
            msg.reply(`${e.message}`);
        } else {
            msg.channel.send(`Unknown error during command execution: **${e.message}**`);
        }
    }

});

client.login(config.token);