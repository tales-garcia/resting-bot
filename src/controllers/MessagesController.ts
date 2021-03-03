import { MessageEmbed } from 'discord.js';
import AppError from '../errors/AppError';
import formatCommand from '../utils/formatCommand';
import RequestController from './RequestController';

export default class MessagesController {

    static async handleMessage(content: string): Promise<MessageEmbed | object> {
        const [, command] = content.split(process.env.BOT_PREFIX || '#');

        if (!command) {
            return MessagesController._printHelp();
        }

        const [action, url] = formatCommand(command);
        const body = command.split('\`\`\`')[1];

        let data: object;

        if (body) {
            const parsedBody = JSON.parse(body) as object;
            data = await MessagesController._handleCommand(action, url, parsedBody);
        } else {
            data = await MessagesController._handleCommand(action, url);
        }

        return data;
    }

    static async _handleCommand(action: string, url: string, body?: object): Promise<object> {

        switch (action) {
            case 'get': {
                if(!url) {
                    throw new AppError(`The command ***${action}*** requires an URL`);
                }
                const data = await RequestController.get(url);
                return data;
            }
            case 'post': {
                if(!url) {
                    throw new AppError(`The command ***${action}*** requires an URL`);
                }
                if (!body) {
                    throw new AppError(`The command ***${action}*** requires a body in \`JSON\` format`)
                }
                const data = await RequestController.post(url, body);
                return data;
            }
            case 'put': {
                if(!url) {
                    throw new AppError(`The command ***${action}*** requires an URL`);
                }
                if (!body) {
                    throw new AppError(`The command ***${action}*** requires a body in \`JSON\` format`)
                }
                const data = await RequestController.put(url, body);
                return data;
            }
            case 'delete': {
                if(!url) {
                    throw new AppError(`The command ***${action}*** requires an URL`);
                }
                const data = await RequestController.delete(url);
                return data;
            }
            case 'help': {
                return MessagesController._printHelp();
            }
            default: {
                throw new AppError(`Invalid command: ***${action}***`);
            }
        }
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
             - \`get [url here]\`
             - \`post [url here] [**JSON** here]\`
             - \`put [url here] [**JSON** here]\`
             - \`delete [url here]\`

             **Examples**
             \`GET\`:
             ${process.env.BOT_PREFIX || '#'} get https://api.github.com/users/tales-garcia

             \`POST\`:
             ${process.env.BOT_PREFIX || '#'} post https://api.github.com/users/tales-garcia \`\`\`
            {
                meaning_of_life: \'42\'
            }\`\`\`

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
            - \`get\`
            - \`post\`
            - \`put\`
            - \`delete\`

            For a full list of commands, type \`${process.env.BOT_PREFIX || '#'} help\` or just \`${process.env.BOT_PREFIX || '#'}\`.

            **Very important note**: The \`JSON\` body must be surrounded with \`\`\`.

            If you have any questions or need help with RESTing bot, **click [here](https://github.com/tales-garcia/resting-bot/issues/new)** to open an issue in **github**!`
        });
    }
}