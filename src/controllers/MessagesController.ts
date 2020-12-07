import * as Discord from 'discord.js';
import config from '../../config/auth';

export default class MessagesController {

    static handleMessage(content: string) : string {
        const [, command] = content.split(config.prefix);

        if (!command) {
            return MessagesController._printHelp();
        }

        return command;
    }

    static _printHelp() : string {
        return '> ***List of commands***\n> - **get** <url>                         Send a GET request to <url>\n> - **post** <url>                       Send a POST reques to <url>\n> - **put** <url>                         Send a PUT request to <url>\n> - **delete** <url>                    Send a DELETE request to <url>';
    }
}