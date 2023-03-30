import { $host } from "../../API"

export const getHashtags = async (hashtag) => {
    const response = await $host.get('/hashtag/getSome', { params: { hashtag } })
    console.log(response)
    return response
}