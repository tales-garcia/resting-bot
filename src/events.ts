import 'dotenv/config';
import * as Discord from 'discord.js';
import MessagesController from './controllers/MessagesController';
import AppError from './errors/AppError';

type EventsType = {
    [key in keyof Discord.ClientEvents]?: (...args: Discord.ClientEvents[key]) => void;
}

function printJSON(msg: Discord.Message, content: string) {
    return msg.channel.send(`\`\`\`json\n${content}\n\`\`\``);
}

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

    if (printableMsgContent) {
        printJSON(msg, printableMsgContent);
    }

    if (rest) {
        printJSON(msg, `${(lineFound.match(/\ /g) || []).map(() => '\u200b').join('')}${rest}`).catch(e => {
            if (e.code === 50035) {
                handleSendMessageError(msg, `${(lineFound.match(/\ /g) || []).map(() => '\u200b').join('')}${rest}`)
            }
        });
    }
}

export default {
    guildCreate: guild => {
        let foundChannel = false;
        guild.channels.cache.forEach(async (channel) => {
            if (channel.type == "text" && !foundChannel) {
                foundChannel = true;
                let textChannel = await channel.fetch(true) as Discord.TextChannel;
                textChannel.send(MessagesController.greet());
            }
        });
    },
    messageUpdate: async msg => {

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
    },
    message: async msg => {

        try {
    
            if (!msg.content.startsWith(process.env.BOT_PREFIX || '#') || msg.author.bot) return;
    
            const data = await MessagesController.handleMessage(msg.content);
    
            if (data instanceof Discord.MessageEmbed) {
    
                msg.channel.send({ embed: data });
                return;
            }
    
            const dataMsg = JSON.stringify(data, undefined, 4);
    
            printJSON(msg, dataMsg).catch(e => {
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
    }
} as EventsType;