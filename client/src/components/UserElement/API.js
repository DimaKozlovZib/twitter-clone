import { $authHost } from "../../API";

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