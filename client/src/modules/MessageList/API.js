import { $authHost, $host } from "../../API";

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