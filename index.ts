import config from './config/auth';
import * as Discord from 'discord.js';
import MessagesController from './src/controllers/MessagesController';

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

client.on('message', msg => {
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    const command = MessagesController.handleMessage(msg.content);

    msg.channel.send(command);
});

client.on('messageUpdate', msg => {
    const updatedContent = msg.channel.messages.cache.first().content;
    
    if (!updatedContent.startsWith(config.prefix) || msg.author.bot) return;

    const command = MessagesController.handleMessage(updatedContent);

    msg.channel.send(command);
});

client.login(config.token);