import { $authHost } from "../../API";

export const addRetweet = async (text, retweetId) => {
    try {
        const response = await $authHost.post('/message', { text, retweetId })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
    }
}