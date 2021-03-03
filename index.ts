import 'dotenv/config';
import * as Discord from 'discord.js';
import MessagesController from './src/controllers/MessagesController';
import AppError from './src/errors/AppError';

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready');
});

function handleSendMessageError(msg: Discord.Message, dataMsg: string) {
    if (!dataMsg) return;

    let characters = 0;
    let lineFound = '';

    dataMsg.split(/\r\n|\r|\n/).forEach(line => {
        characters += line.length;

        if (characters >= 1900 && !lineFound) {
            lineFound = line;
        }
    });


    dataMsg = dataMsg.replace(lineFound, `:84386572823465367365,,,.....;;;;;;lllllll${lineFound}`);

    const [printableMsgContent, rest] = dataMsg.split(':84386572823465367365,,,.....;;;;;;lllllll');

    msg.channel.send(printableMsgContent);

    if (rest) {
        msg.channel.send(`${(rest.match(/\ /g) || []).map(() => '\u200b').join('')}${rest}`).catch(e => {
            if (e.code === 50035) {
                handleSendMessageError(msg, `${(rest.match(/\ /g) || []).map(() => '\u200b').join('')}${rest}`)
            }
        });
    }
}

client.on('message', async msg => {

    try {

        if (!msg.content.startsWith(process.env.BOT_PREFIX || '#') || msg.author.bot) return;

        const data = await MessagesController.handleMessage(msg.content);

        if (data instanceof Discord.MessageEmbed) {

            msg.channel.send({ embed: data });
            return;
        }

        const dataMsg = `\`\`\`json\n${JSON.stringify(data, undefined, 4)}\n\`\`\``;

        msg.channel.send(dataMsg).catch(e => {
            if (e.code === 50035) {
                handleSendMessageError(msg, dataMsg)
            }
        });
    } catch (e) {
        if (e instanceof AppError) {
            msg.reply(`${e.message}`);
        } else {
            msg.channel.send(`Unknown error during command execution: **${e.message}**`)
        }
    }
});

client.on('messageUpdate', async msg => {

    if(!msg.author) return;

    try {
        const updatedContent = msg.channel.messages.cache.first()?.content;

        if(!updatedContent) return;

        if (!updatedContent.startsWith(process.env.BOT_PREFIX || '#') || msg.author.bot) return;

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

client.on('guildCreate', guild => {
    let foundChannel = false;
    guild.channels.cache.forEach(async (channel) => {
        if (channel.type == "text" && !foundChannel) {
            foundChannel = true;
            let textChannel = await channel.fetch(true) as Discord.TextChannel;
            textChannel.send(MessagesController.greet());
        }
    });
});

client.login(process.env.CLIENT_SECRET);