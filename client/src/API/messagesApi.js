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