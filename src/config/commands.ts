import RequestController from '../controllers/RequestController';
import MessagesController from '../controllers/MessagesController';

type commandsType = {
    [key: string]: {
        requires: string[];
        execute: (url: string, body?: object) => Promise<object>;
    };
};

const commands: commandsType = {
    get: {
        requires: ["url"],
        execute: async (url) => {
            const data = await RequestController.get(url);
            return data;
        }
    },
    post: {
        requires: ["url", "body"],
        execute: async (url, body) => {
            const data = await RequestController.post(url, (body as object));
            return data;
        }
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