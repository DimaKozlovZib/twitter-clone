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
    const response = await $authHost.post('/user/login', {})
    return response;
}

//export const authCheck = async () => {
//    const response = await $host.post('/user/auth', { email, password })
//    return response;
//}