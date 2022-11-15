import { $host } from '.';

export const getMessages = async (page, limit = 20) => {
    const response = await $host.get('/message', { props: { page, limit } })
    console.log(response)
    return response;
}