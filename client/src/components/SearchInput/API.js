import { $authHost } from "../../API"

export const getFirstConnectionUsers = async () => {
    try {
        const result = await $authHost.get('/user/getFirstConnectionUsers')
        return result
    } catch (error) {
        return error
    }
}

export const getPossibleSearchData = async (searchString) => {
    try {
        const limit = 3;
        const result = await $authHost.get('/search', { params: { limit, searchString } })
        return result
    } catch (error) {
        return error
    }
}