import { $host } from '../../API';

export const searchUsers = async (text, limit) => {
    try {
        const response = await $host.post('/user/searchUsersByString', { text, limit })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error;
    }
}

export const searchHashtags = async (text, limit) => {
    try {
        const response = await $host.post('/hashtag/searchHashtag', { text, limit })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error;
    }
}

export const searchMessages = async (text, limit) => {
    try {
        const response = await $host.post('/message/searchMessages', { text, limit })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error;
    }
}