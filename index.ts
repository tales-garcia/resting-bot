import 'dotenv/config';
import * as Discord from 'discord.js';
import events from './src/config/events';
import commands from './src/config/commands';

const client = new Discord.Client();

client.once('ready', async () => {
    console.log('Ready');

    Object.keys(commands).forEach(key => {
        const command = commands[key]

        const options = command.requires.map(param => ({
            name: param,
            description: 'ef',
            type: 3,
            required: true
        }))

        client.api.applications(client.user.id).commands.post({data:{
            name: key,
            description: command.description,
            options
        }});
    });

    client.api.applications(client.user.id).commands.set([]);

});

Object.keys(events).forEach(key => {
    client.on(key, (events as any)[key]);
});


client.login(process.env.CLIENT_SECRET);