import { $authHost } from "../../API"

export const setCover = async (file) => {
    try {
        const res = await $authHost.post('/user/setCover', file)
        console.log(res)
        return res;
    } catch (error) {
        console.error(error)
    }
}