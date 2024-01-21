import { $authHost, $host } from "../../API"

export const getHashtag = async (hashtagName) => {
    try {
        const response = await $host.get(`/hashtag/${hashtagName}`)
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const getMessages = async (id, limit, page, viewedData) => {
    try {
        const response = await $authHost.post(`/hashtag/${id}/messages?limit=${limit}&page=${page}`,
            { viewedData: { messages: viewedData } })
        return response;
    } catch (error) {
        return error;
    }
}