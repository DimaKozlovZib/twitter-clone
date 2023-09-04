import { $authHost, $host } from "../../API";

export const getUser = async (userId, isAuth) => {
    try {
        const requestHost = isAuth ? $authHost : $host;
        const response = await requestHost.get(`/user/${userId}`)
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const getMessages = async (userId, limit, page) => {
    try {
        const response = await $host.get(`/user/content/${userId}`, { props: { limit, page } })
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