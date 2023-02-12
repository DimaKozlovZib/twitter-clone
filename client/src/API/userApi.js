import { $authHost, $host } from "./index";

export const registration = async (name, email, password, age) => {
    try {
        const response = await $host.post('/user/registration', { name, email, password, age })
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}

export const login = async () => {
    const response = await $authHost.post('/user/autoLogin', {})
    return response;
}

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