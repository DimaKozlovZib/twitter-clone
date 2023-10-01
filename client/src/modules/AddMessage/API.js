import { $authHost } from "../../API";

export const addMessages = async (text, images) => {
    try {
        const response = await $authHost.post('/message', { text, images })
        console.log(response)
        return response;
    } catch (error) {
        return error;
    }
}