import { $authHost } from '.';

export const getMessages = (params) => {
    try {
        return $authHost.get('/message', { params: params })
    } catch (error) {
        console.error(error)
        return error
    }
}

export const getMessagesByHashtag = async (hashtagName, params) => {
    try {
        const response = await $authHost.get(`/hashtag/${hashtagName}/getMessages`, { params: params })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const likeMessage = async (mesId) => {
    try {
        const response = await $authHost.post('/message/like', { params: { mesId } })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const getMessageContent = async (messageId, getRetweet, getLikes) => {
    try {
        const response = await $authHost.post('/message/getMessageContent', { messageId, getRetweet, getLikes })
        return response;
    } catch (error) {
        return error
    }
}