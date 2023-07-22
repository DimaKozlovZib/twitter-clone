import { $authHost } from "../../API";

export const likeMessage = async (mesId) => {
    const response = await $authHost.post('/message/like', { params: { mesId } })
    console.log(response)
    return response;
}

export const messageShown = async (mesId) => {
    try {
        const response = await $authHost.post('/message/messageShown', { mesId })
        return response;
    } catch (error) {
        console.error(error)
    }
}