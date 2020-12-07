import axios from 'axios';

export default class RequestController {

    static async get(url: string) : Promise<object> {
        const res = await axios.get(url);

        return res.data;
    }
}