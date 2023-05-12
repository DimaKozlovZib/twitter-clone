import { $authHost } from "../../API";

export const setAvatar = async (file) => {
    try {
        const res = await $authHost.post('/user/setAvatar', file)
        console.log(res)
        return res;
    } catch (error) {
        console.error(error)
    }
}