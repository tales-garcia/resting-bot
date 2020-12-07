import config from '../../config/auth';
import AppError from '../errors/AppError';
import formatCommand from '../utils/formatCommand';

export default class MessagesController {

    static handleMessage(content: string) : string {
        const [, command] = content.split(config.prefix);

        if (!command) {
            return MessagesController._printHelp();
        }

        const [action, url] = formatCommand(command);
        const body = command.split('\`\`\`')[1];

        if(body) {
            const parsedBody = JSON.parse(body) as object;
            MessagesController._handleCommand(action, url, parsedBody);
        } else {
            MessagesController._handleCommand(action, url);
        }

        return command;
    }

    static _handleCommand(action: string, url: string, body?: object) {

        switch (action) {
            case 'get': {
                break;
            }
            case 'post': {
                if(!body) {
                    throw new AppError(`The command ${action} requires a body in \`JSON\` format`)
                }
                break;
            }
            case 'put': {
                if(!body) {
                    throw new AppError(`The command ${action} requires a body in \`JSON\` format`)
                }
                break;
            }
            case 'delete': {
                break;
            }
            default: {
                throw new AppError(`Invalid command: *${action}*`);
            }
        }
    }

    static _printHelp() : string {
        return '> ***List of commands***\n> - **get** <url>                         Send a GET request to <url>\n> - **post** <url> <body>        Send a POST reques to <url>\n> - **put** <url> <body>          Send a PUT request to <url>\n> - **delete** <url>                    Send a DELETE request to <url>';
    }
}