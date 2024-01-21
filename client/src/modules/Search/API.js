import { $authHost } from '../../API';

export const search = async (searchString, limit, page, onlyModel) => {
    try {
        const needFriend = true;
        const result = await $authHost.get('/search', { params: { limit, page, searchString, onlyModel, needFriend } })
        return result
    } catch (error) {
        console.error(error)
        return error;
    }
}
