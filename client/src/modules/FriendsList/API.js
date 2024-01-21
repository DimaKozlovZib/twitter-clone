import { $authHost } from "../../API"

export const getUsersData = async (page, limit) => {
    try {
        const res = await $authHost.get('/user/friends', { params: { page, limit } })
        console.log(res)
        return res
    } catch (error) {
        console.error(error)
    }
}