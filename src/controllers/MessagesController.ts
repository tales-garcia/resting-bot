import config from '../../config/auth';
import AppError from '../errors/AppError';
import formatCommand from '../utils/formatCommand';
import RequestController from './RequestController';

export default class MessagesController {

    static async handleMessage(content: string) : Promise<string | object> {
        const [, command] = content.split(config.prefix);

        if (!command) {
            return MessagesController._printHelp();
        }

        const [action, url] = formatCommand(command);
        const body = command.split('\`\`\`')[1];

        let data: object;

        if(body) {
            const parsedBody = JSON.parse(body) as object;
            data = await MessagesController._handleCommand(action, url, parsedBody);
        } else {
            data = await MessagesController._handleCommand(action, url);
        }

        return data;
    }

    static async _handleCommand(action: string, url: string, body?: object) : Promise<object> {

        switch (action) {
            case 'get': {
                const data = await RequestController.get(url);
                return data;
            }
            case 'post': {
                if(!body) {
                    throw new AppError(`The command ***${action}*** requires a body in \`JSON\` format`)
                }
                const data = await RequestController.post(url, body);
                return data;
            }
            case 'put': {
                if(!body) {
                    throw new AppError(`The command ***${action}*** requires a body in \`JSON\` format`)
                }
                const data = await RequestController.put(url, body);
                return data;
            }
            case 'delete': {
                const data = await RequestController.delete(url);
                return data;
            }
            default: {
                throw new AppError(`Invalid command: ***${action}***`);
            }
        }
    }

    static _printHelp() : string {
        return '> ***List of commands***\n> - **get** <url>                         Send a GET request to <url>\n> - **post** <url> <body>        Send a POST reques to <url>\n> - **put** <url> <body>          Send a PUT request to <url>\n> - **delete** <url>                    Send a DELETE request to <url>';
    }
}