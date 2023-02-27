import { $authHost } from "../../API";

export const addMessages = async (text) => {
    const response = await $authHost.post('/message', { text })
    console.log(response)
    return response;
}