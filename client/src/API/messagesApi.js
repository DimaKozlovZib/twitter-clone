import { $host, $authHost } from '.';

export const getMessages = async ({ pageNum, limit = 20, onlyThisUserId, isAuth }) => {
    try {
        const requestHost = isAuth ? $authHost : $host;
        const response = await requestHost.get('/message', { props: { pageNum, limit, onlyThisUserId } })
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