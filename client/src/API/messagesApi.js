import { $host, $authHost } from '.';

export const getMessages = async (pageNum, limit = 20, isAuth, userId) => {
    try {
        const requestHost = isAuth ? $authHost : $host;
        const props = userId ? { pageNum, limit, userId } : { pageNum, limit }

        const response = await requestHost.get('/message', { props })

        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const addMessages = async (text) => {
    const response = await $authHost.post('/message', { text })
    console.log(response)
    return response;
}


export const likeMessage = async (type, mesId) => {
    const response = await $authHost.post('/message/like', { params: { mesId, type } })
    console.log(response)
    return response;
}