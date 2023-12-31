import { $authHost } from '../../API';

export const search = async (searchString, limit, onlyModel) => {
    try {
        const needFriend = true;
        const result = await $authHost.get('/search', { params: { limit, searchString, onlyModel, needFriend } })
        return result
    } catch (error) {
        console.error(error)
        return error;
    }
}
