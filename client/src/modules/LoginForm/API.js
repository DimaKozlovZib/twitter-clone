import { $host } from "../../API";

export async function login(email, password) {
    try {
        const response = await $host.post('/user/login', { email, password })
        return response;
    } catch (error) {
        console.log(error)
    }

}