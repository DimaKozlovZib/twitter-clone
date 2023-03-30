import { $authHost } from "../../API";

export const addMessages = async (text, hashtags) => {
    const response = await $authHost.post('/message', { text, hashtags })
    console.log(response)
    return response;
}