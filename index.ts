import 'dotenv/config';
import * as Discord from 'discord.js';
import events from './src/config/events';
import commands from './src/config/commands';

const client = new Discord.Client({
    intents: [Discord.Intents.NON_PRIVILEGED]
});

client.once('ready', async () => {
    console.log('Ready');

    client.user?.setStatus('dnd');

    Object.keys(commands).forEach(key => {
        const command = commands[key]

        client.application?.commands.create({
            name: key,
            description: command.description,
            options: command.options,
        })
    });

});

Object.keys(events).forEach(key => {
    client.on(key, (events as any)[key]);
});


client.login(process.env.CLIENT_SECRET);