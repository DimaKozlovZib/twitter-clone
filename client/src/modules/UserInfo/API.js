import { $authHost, $host } from "../../API";

export const getUser = async (id, isAuth) => {
    try {
        const requestHost = isAuth ? $authHost : $host;
        const response = await requestHost.get(`/user/${id}`)
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}