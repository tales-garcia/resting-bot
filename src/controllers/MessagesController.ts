import { MessageEmbed } from 'discord.js';
import AppError from '../errors/AppError';
import formatCommand from '../utils/formatCommand';
import commands from '../config/commands';

export default class MessagesController {

    static async handleMessage(content: string): Promise<MessageEmbed | object | string> {
        const splittedCommand = content.split('');
        splittedCommand.splice(0, (process.env.BOT_PREFIX || '-').length);

        const command = splittedCommand.join('');

        if (!command) {
            return MessagesController._printHelp();
        }

        const [action, ...args] = formatCommand(command);

        const data: object | string = MessagesController._handleCommand(action, ...args);

        return data;
    }

    static async _handleCommand(action: string, ...args: any[]): Promise<object | string> {

        if (!commands[action]) {
            throw new AppError(`Invalid command: ***${action}***`);
        }

        const missingParam = commands[action].options.find((param, index) => !args[index] && param.required);

        if (missingParam) {
            throw new AppError(`The command ***${action}*** requires the param: **${missingParam.name}**`);
        }

        args = commands[action].options.map((param, index) => {
            if (commands[action].parser && commands[action].parser![param.name]) {
                return commands[action].parser![param.name](args[index]);
            }
            return args[index];
        });

        return await commands[action].execute(...args);
    }

    static _printHelp(): MessageEmbed {
        return new MessageEmbed({
            color: '#202225',
            author: {
                icon_url: process.env.BOT_IMAGE,
                name: 'RESTing bot'
            },
            description: `RESTing bot is a discord bot that make requests to REST API's by chat, and prints the response data in chat.
            ​
            ​To get started, get to a text channel, type \`${process.env.BOT_PREFIX || '-'} [your request type here] [request URL here] [if required, JSON body here]\`.

            **Commands**
            The supported commands and request types by RESTing bot are:
            ${Object.keys(commands).map(command => `- \`${command} ${commands[command].options.map(param => `[${param.name} here]`).join(' ')}\`\n`).join('')}
            **Examples**

            ${Object.keys(commands).filter(command => !!commands[command].example).map(command => `\`${command.toUpperCase()}\`:${commands[command].example}`).join('\n')}
            **Add to Discord**
            To add RESTing bot to a server, click [here](${process.env.BOT_INVITE_URL}).

            **Support**
            Click [here](${process.env.GITHUB_REPO}/issues/new) to open an issue in github if you're having trouble or have any questions.`
        });
    }

    static greet(): MessageEmbed {
        return new MessageEmbed({
            color: '#202225',
            title: 'Glad to be added to your server! :wave:',
            description: `To get started, get to a text channel, type \`${process.env.BOT_PREFIX || '-'} [your request type here] [request URL here] [if required, JSON body here]\`. I support:
            ${Object.keys(commands).map(command => `- \`${command}\`\n`).join('')}

            For a full list of commands, type \`${process.env.BOT_PREFIX || '-'} help\` or just \`${process.env.BOT_PREFIX || '-'}\`.

            **Add to Discord**
            To add RESTing bot to a server, click [here](https://discord.com/api/oauth2/authorize?client_id=785489602143322134&permissions=0&scope=applications.commands%20bot).

            If you have any questions or need help with RESTing bot, **click [here](${process.env.GITHUB_REPO}/issues/new)** to open an issue in **github**!`
        });
    }
}