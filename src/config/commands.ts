import RequestController from '../controllers/RequestController';
import MessagesController from '../controllers/MessagesController';
import AppError from '../errors/AppError';

type commandsType = {
    [key: string]: {
        requires: string[];
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
        requires: ["url"],
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
        requires: ["url", "body"],
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
        requires: ["url", "body"],
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
        requires: ["url"],
        description: 'Sends a request of DELETE type',
        execute: async (url: string) => {
            const data = await RequestController.delete(url);
            return data;
        }
    },
    help: {
        requires: [],
        description: 'Prints the help message',
        execute: async () => {
            return MessagesController._printHelp();
        }
    }
}

export default commands;