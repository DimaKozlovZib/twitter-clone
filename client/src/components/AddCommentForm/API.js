import { $authHost } from "../../API"

export const addComment = async (text, messageId) => {
    try {
        const response = await $authHost.post('/message/addCommentToMessage', { text, messageId })
        return response;
    } catch (error) {
        return error;
    }
}