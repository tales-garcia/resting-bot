const { token, prefix } = require('./config/auth.json');
const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const [, command] = msg.content.split(prefix);

    if(!command) {
        printHelp(msg);
        return;
    }

    msg.channel.send(command);
});

function printHelp(msg) {
    msg.channel.send('help')
}

client.login(token);