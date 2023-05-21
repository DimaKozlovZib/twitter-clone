import { $authHost } from "../../API"

export const getUsersData = async (page) => {
    try {
        const res = await $authHost.get('/user/friends', { params: { page } })
        console.log(res)
        return res
    } catch (error) {
        console.error(error)
    }
}