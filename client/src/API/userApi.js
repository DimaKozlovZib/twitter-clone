import { $authHost } from "./index";

export const login = async () => {
    const response = await $authHost.post('/user/autoLogin', {})
    return response;
}