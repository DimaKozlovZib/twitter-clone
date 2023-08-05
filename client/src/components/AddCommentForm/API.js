import { $authHost } from "../../API"

export const addComment = async (text, messageId) => {
    try {
        const response = await $authHost.post('/message/addCommentToMessage', { text, messageId })
        return response;
    } catch (error) {
        return error;
    }
}

export const setCommentMood = async (text, messageId) => {
    try {
        const response = await $authHost.post('/message/setCommentMood', { text, messageId })
        console.log(response)
    } catch (error) {
        console.error(error)
    }
}