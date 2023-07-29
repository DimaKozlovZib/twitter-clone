import { $authHost } from "../../API";

export const messageShown = async (mesId) => {
    try {
        const response = await $authHost.post('/message/messageShown', { mesId })
        return response;
    } catch (error) {
        console.error(error)
    }
}