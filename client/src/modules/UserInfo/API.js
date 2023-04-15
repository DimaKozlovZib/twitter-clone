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