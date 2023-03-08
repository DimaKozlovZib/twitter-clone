import { $host, $authHost } from '.';

export const getMessages = async (pageNum, limit = 20, isAuth, pageParams) => {
    try {
        const requestHost = isAuth ? $authHost : $host;
        const userId = +pageParams?.id;
        const requestParams = userId ? { pageNum, limit, userId } : { pageNum, limit }

        const response = await requestHost.get('/message', { params: requestParams })

        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}