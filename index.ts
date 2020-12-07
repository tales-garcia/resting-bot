import config from './config/auth';
import * as Discord from 'discord.js';
import MessagesController from './src/controllers/MessagesController';
import AppError from './src/errors/AppError';

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

client.on('message', msg => {

    try {

        if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

        const response = MessagesController.handleMessage(msg.content);

        msg.channel.send(response);
    } catch (e) {
        if (e instanceof AppError) {
            msg.reply(`${e.message}`);
        } else {
            msg.channel.send(`Unknown error during command execution: **${e.message}**`)
        }
    }
});

client.on('messageUpdate', msg => {

    try {
        const updatedContent = msg.channel.messages.cache.first().content;

        if (!updatedContent.startsWith(config.prefix) || msg.author.bot) return;

        const command = MessagesController.handleMessage(updatedContent);

        msg.channel.send(command);

    } catch (e) {
        if (e instanceof AppError) {
            msg.reply(`${e.message}`);
        } else {
            msg.channel.send(`Unknown error during command execution: **${e.message}**`);
        }
    }

});

client.login(config.token);