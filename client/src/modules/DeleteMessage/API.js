import { $authHost } from "../../API";

export const DeleteFunc = async (id) => {
    try {
        const res = await $authHost.delete(`/message/${id}`)
        return res
    } catch (error) {
        return error
    }
}