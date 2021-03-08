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
    };
};

const commands: commandsType = {
    get: {
        requires: ["url"],
        execute: async (url: string) => {
            const data = await RequestController.get(url);
            return data;
        },
        example: `
        ${process.env.BOT_PREFIX || '#'}get https://api.github.com/users/tales-garcia 
        `
    },
    post: {
        requires: ["url", "body"],
        parser: {
            body: (body) => {
                try {
                    return JSON.parse(body.replace('\`', ''));
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw new AppError('Invalid \`JSON\` sysntax');
                    }
                    throw new Error(e);
                }
            }
        },
        execute: async (url: string, body: string) => {
            const data = await RequestController.post(url, JSON.parse(body.replace('\`\`\`', '')));
            return data;
        },
        example: `
        ${process.env.BOT_PREFIX || '#'}post https://api.github.com/users/tales-garcia 
        \`\`\`{\n   meaning_of_life: \'42\'\n}\`\`\`
        `
    },
    put: {
        requires: ["url", "body"],
        parser: {
            body: (body) => {
                try {
                    return JSON.parse(body.replace('\`', ''));
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        throw new AppError('Invalid \`JSON\` sysntax');
                    }
                    throw new Error(e);
                }
            }
        },
        execute: async (url: string, body: string) => {
            const data = await RequestController.put(url, JSON.parse(body.replace('\`\`\`', '')));
            return data;
        }
    },
    delete: {
        requires: ["url"],
        execute: async (url: string) => {
            const data = await RequestController.delete(url);
            return data;
        }
    },
    help: {
        requires: [],
        execute: async () => {
            return MessagesController._printHelp();
        }
    }
}

export default commands;