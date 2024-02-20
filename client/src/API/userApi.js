import { $authHost } from ".";

export const login = async () => {
    try {
        const response = await $authHost.post('/user/autoLogin', {});
        return response
    } catch (error) {
        console.log(error)
        return error
    }
}