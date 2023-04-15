import { $host } from "../../API"

export const getHashtag = async (id) => {
    try {
        const response = await $host.get(`/hashtag/${id}`)
        console.log(response)
        return response;
    } catch (error) {
        console.error(error)
        return error
    }
}