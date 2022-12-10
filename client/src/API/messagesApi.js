import { $host, $authHost } from '.';

export const getMessages = async (page, limit = 20) => {
    const response = await $host.get('/message', { props: { page, limit } })
    console.log(response)
    return response;
}

export const addMessages = async (text) => {
    const response = await $authHost.post('/message', { text })
    console.log(response)
    return response;
}