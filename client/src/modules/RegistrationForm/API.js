import { $host } from "../../API";

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