import 'dotenv/config';
import * as Discord from 'discord.js';
import events from './src/events';

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

Object.keys(events).forEach(key => {
    client.on(key, (events as any)[key]);
});


client.login(process.env.CLIENT_SECRET);