import RequestController from '../controllers/RequestController';
import MessagesController from '../controllers/MessagesController';
import AppError from '../errors/AppError';
import { ApplicationCommandOptionData } from 'discord.js';

type commandsType = {
    [key: string]: {
        options: ApplicationCommandOptionData[];
        parser?: {
            [key: string]: (param: string) => any;
        };
        execute: (...args: any[]) => Promise<object | string>;
        example?: string;
        description: string;
    };
};

const commands: commandsType = {
    get: {
        options: [
            {
                name: 'url',
                description: 'The url to send a request to',
                type: 'STRING',
                required: true
            }
        ],
        description: 'Sends a request of GET type',
        execute: async (url: string) => {
            const data = await RequestController.get(url);
            return data;
        },
        example: `
        ${process.env.BOT_PREFIX || '-'}get https://api.github.com/users/tales-garcia 
        `
    },
    post: {
        options: [
            {
                name: 'url',
                description: 'The url to send a request to',
                type: 'STRING',
                required: true
            },
            {
                name: 'body',
                description: 'The body in JSON format to send',
                type: 'STRING',
                required: true
            }
        ],
        description: 'Sends a request of POST type',
        parser: {
            body: (body) => {
                try {
                    return JSON.parse(body.replace(/\`/g, ''));
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw new AppError('Invalid \`JSON\` syntax');
                    }
                    throw new Error(e);
                }
            }
        },
        execute: async (url: string, body: object) => {
            const data = await RequestController.post(url, body);
            return data;
        },
        example: `
        ${process.env.BOT_PREFIX || '-'}post https://api.github.com/users/tales-garcia 
        \`\`\`{\n   meaning_of_life: \'42\'\n}\`\`\`
        `
    },
    put: {
        options: [
            {
                name: 'url',
                description: 'The url to send a request to',
                type: 'STRING',
                required: true
            },
            {
                name: 'body',
                description: 'The body in JSON format to send',
                type: 'STRING',
                required: true
            }
        ],
        description: 'Sends a request of PUT type',
        parser: {
            body: (body) => {
                try {
                    return JSON.parse(body.replace(/\`/g, ''));
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw new AppError('Invalid \`JSON\` syntax');
                    }
                    throw new Error(e);
                }
            }
        },
        execute: async (url: string, body: object) => {
            const data = await RequestController.put(url, body);
            return data;
        }
    },
    delete: {
        options: [
            {
                name: 'url',
                description: 'The url to send a request to',
                type: 'STRING',
                required: true
            }
        ],
        description: 'Sends a request of DELETE type',
        execute: async (url: string) => {
            const data = await RequestController.delete(url);
            return data;
        }
    },
    help: {
        options: [],
        description: 'Prints the help message',
        execute: async () => {
            return MessagesController._printHelp();
        }
    }
}

export default commands;