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
        return 'help';
    }
}