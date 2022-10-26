import axios from 'axios'
import { selverPath } from './constants'

export async function getMessages(page, limit = 20) {
    try {
        const result = await axios.get(`${selverPath}/message`, {
            props: { page, limit }
        });
        console.log(result)
        return result;
    } catch (error) {
        console.log(error)
        return error;
    }
}