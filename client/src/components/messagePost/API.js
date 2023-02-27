import { $authHost } from "../../API";

export const likeMessage = async (mesId) => {
    const response = await $authHost.post('/message/like', { params: { mesId } })
    console.log(response)
    return response;
}