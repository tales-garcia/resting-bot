import { MessageEmbed } from 'discord.js';
import AppError from '../errors/AppError';
import formatCommand from '../utils/formatCommand';
import commands from '../config/commands';

export default class MessagesController {

    static async handleMessage(content: string): Promise<MessageEmbed | object | string> {
        const [, command] = content.split(process.env.BOT_PREFIX || '#');

        if (!command) {
            return MessagesController._printHelp();
        }

        const [action, url] = formatCommand(command);
        const body = command.split('\`\`\`')[1];

        let data: object | string;

        if (body) {
            const parsedBody = JSON.parse(body) as object;
            data = await MessagesController._handleCommand(action, url, parsedBody);
        } else {
            data = await MessagesController._handleCommand(action, url);
        }

        return data;
    }

    static async _handleCommand(action: string, url: string, body?: object): Promise<object | string> {

        if (!commands[action]) {
            throw new AppError(`Invalid command: ***${action}***`);
        }

        const args: { [key: string]: any } = {
            url,
            body
        };

        const missingParam = commands[action].requires.find(requiredField => !args[requiredField]);

        if (missingParam) {
            throw new AppError(`The command ***${action}*** requires the param: **${missingParam}**`);
        }

        return await commands[action].execute(url, body);
    }

    static _printHelp(): MessageEmbed {
        return new MessageEmbed({
            color: '#202225',
            author: {
                icon_url: 'https://cdn.discordapp.com/app-icons/785489602143322134/2920f31bf6a40b261579716421647179.png?size=64',
                name: 'RESTing bot'
            },
            description: `RESTing bot is a discord bot that make requests to REST API's by chat, and prints the response data in chat.
            ​
            ​To get started, get to a text channel, type \`${process.env.BOT_PREFIX || '#'} [your request type here] [request URL here] [if required, JSON body here]\`.

            **Commands**
            The supported commands and request types by RESTing bot are:
            ${Object.keys(commands).map(command => `- \`${command} ${commands[command].requires.map(param => `[${param} here]`).join(' ')}\`\n`).join('')}
            **Examples**

            ${Object.keys(commands).filter(command => !!commands[command].example).map(command => `\`${command.toUpperCase()}\`:${commands[command].example}`).join('\n')}
            **Add to Discord**
            To add RESTing bot to a server, click [here](https://discord.com/oauth2/authorize?client_id=785489602143322134&scope=bot).

            **Support**
            Click [here](https://github.com/tales-garcia/resting-bot/issues/new) to open an issue in github if you're having trouble or have any questions.`
        });
    }

    static greet(): MessageEmbed {
        return new MessageEmbed({
            color: '#202225',
            title: 'Glad to be added to your server! :wave:',
            description: `To get started, get to a text channel, type \`${process.env.BOT_PREFIX || '#'} [your request type here] [request URL here] [if required, JSON body here]\`. I support:
            ${Object.keys(commands).map(command => `- \`${command}\`\n`).join('')}

            For a full list of commands, type \`${process.env.BOT_PREFIX || '#'} help\` or just \`${process.env.BOT_PREFIX || '#'}\`.

            **Very important note**: The \`JSON\` body must be surrounded with \`\`\`.

            If you have any questions or need help with RESTing bot, **click [here](https://github.com/tales-garcia/resting-bot/issues/new)** to open an issue in **github**!`
        });
    }
}