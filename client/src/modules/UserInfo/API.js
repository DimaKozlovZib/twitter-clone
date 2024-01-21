import { $authHost, $host } from "../../API";

export const getUser = async (userId, isAuth) => {
    try {
        const requestHost = isAuth ? $authHost : $host;
        const response = await requestHost.get(`/user/${userId}`)

        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const getMessages = async (userId, limit, page, viewedData) => {
    try {
        const response = await $host.post(`/user/content/${userId}?limit=${limit}&page=${page}`, { viewedData: { messages: viewedData } })
        return response;
    } catch (error) {
        return error;
    }
}

export const Subscribe = async (userId) => {
    try {
        const response = await $authHost.post('/user/subscribe', { userId })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const Unsubscribe = async (userId) => {
    try {
        const response = await $authHost.post('/user/unsubscribe', { userId })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}