import RequestController from '../controllers/RequestController';
import MessagesController from '../controllers/MessagesController';
import AppError from '../errors/AppError';

type commandsType = {
    [key: string]: {
        requires: string[];
        execute: (url: string, body?: object) => Promise<object | string>;
        example?: string;
    };
};

const commands: commandsType = {
    get: {
        requires: ["url"],
        execute: async (url) => {
            const data = await RequestController.get(url);
            return data;
        },
        example: `
        ${process.env.BOT_PREFIX || '#'}post https://api.github.com/users/tales-garcia 
        `
    },
    post: {
        requires: ["url", "body"],
        execute: async (url, body) => {
            const data = await RequestController.post(url, (body as object));
            return data;
        },
        example: `
        ${process.env.BOT_PREFIX || '#'}post https://api.github.com/users/tales-garcia 
        \`\`\`{\n   meaning_of_life: \'42\'\n}\`\`\`
        `
    },
    put: {
        requires: ["url", "body"],
        execute: async (url, body) => {
            const data = await RequestController.put(url, (body as object));
            return data;
        }
    },
    delete: {
        requires: ["url"],
        execute: async (url) => {
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