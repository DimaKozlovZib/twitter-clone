import { $authHost, $host } from "../../API";

export const getUser = async (name, isAuth) => {
    try {
        const requestHost = isAuth ? $authHost : $host;
        const response = await requestHost.get(`/user/${name}`)
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
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