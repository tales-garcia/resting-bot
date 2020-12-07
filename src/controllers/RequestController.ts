import axios from 'axios';

export default class RequestController {

    static async get(url: string) : Promise<object> {
        const res = await axios.get(url);

        return res.data;
    }
    static async post(url: string, body: object) : Promise<object> {
        const res = await axios.post(url, body);

        return res.data;
    }
    static async put(url: string, body: object) : Promise<object> {
        const res = await axios.put(url, body);

        return res.data;
    }
    static async delete(url: string) : Promise<object> {
        const res = await axios.delete(url);

        return res.data;
    }
}