import { $host, $authHost } from '.';

export const getMessages = async (params) => {
    try {
        const response = await $authHost.get('/message', { params: params })

        console.log(response)
        return response;
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