import 'dotenv/config';
import * as Discord from 'discord.js';
import MessagesController from '../controllers/MessagesController';
import AppError from '../errors/AppError';
import commands from './commands';
import splitResponse from '../utils/splitResponse';

type EventsType = {
    [key in keyof Discord.ClientEvents]?: (...args: Discord.ClientEvents[key]) => void;
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
    messageUpdate: async (_, msg) => {

        if (!msg.author) return;

        try {
            const updatedContent = msg.content;

            if (!updatedContent) return;

            if (!updatedContent.startsWith(process.env.BOT_PREFIX || '-') || msg.author.bot) return;

            const data = await MessagesController.handleMessage(updatedContent);

            if (data instanceof Discord.MessageEmbed) {

                msg.channel.send({ embed: data });
                return;
            }

            const dataMsg = splitResponse(JSON.stringify(data, undefined, 4));

            dataMsg.forEach(content => msg.channel.send(`\`\`\`json\n${content}\n\`\`\``))

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

            if (!msg.content.startsWith(process.env.BOT_PREFIX || '-') || msg.author.bot) return;

            const data = await MessagesController.handleMessage(msg.content);

            if (data instanceof Discord.MessageEmbed) {

                msg.channel.send({ embed: data });
                return;
            }

            const dataMsg = splitResponse(JSON.stringify(data, undefined, 4));

            dataMsg.forEach(content => msg.channel.send(`\`\`\`json\n${content}\n\`\`\``))
        } catch (e) {
            if (e instanceof AppError) {
                msg.reply(`${e.message}`);
            } else {
                msg.channel.send(`Unknown error during command execution: **${e.message}**`)
            }
        }
    },
    interaction: async interaction => {
        if (!interaction.isCommand()) return;

        try {
            const args = interaction.options.map(option => {
                if (commands[interaction.commandName].parser && commands[interaction.commandName].parser![option.name]) {
                    return commands[interaction.commandName].parser![option.name](option.value);
                }
                return option.value;
            });

            const data = await commands[interaction.commandName].execute(...args);

            if (data instanceof Discord.MessageEmbed) {
                await interaction.reply(data);
                return;
            }

            await interaction.defer();

            const stringData = JSON.stringify(data, undefined, 4);

            const splittedData = splitResponse(stringData);

            splittedData.forEach(async (content, index) => {
                if (index === 0) {
                    interaction.editReply(`\`\`\`json\n${content}\n\`\`\``);
                    return;
                }
                (await interaction.fetchReply()).channel.send(`\`\`\`json\n${content}\n\`\`\``);
            });

        } catch (e) {
            if (e instanceof AppError) {
                interaction.reply(`${e.message}`);
            } else {
                interaction.reply(`Unknown error during command execution: **${e.message}**`)
            }
        }
    }
} as EventsType;