import { $authHost } from "../../API";

export const addMessages = async (text, hashtagsString, retweetId) => {
    try {
        const response = await $authHost.post('/message', {
            text, hashtagsString, retweetId
        })
        console.log(response)
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}

export const addMediaRequest = async (formData, index, messageId) => {
    try {
        const response = await $authHost.post(`/${messageId}/addMedia?index=${index}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        console.log(response)
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}