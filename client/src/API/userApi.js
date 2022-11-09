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

export const login = async (email, password) => {
    const response = await $host.post('/user/login', { email, password })
    return response;
}

//export const authCheck = async () => {
//    const response = await $host.post('/user/auth', { email, password })
//    return response;
//}