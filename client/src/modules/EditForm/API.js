import { $authHost } from "../../API";

export const editInfo = async (changes) => {
    try {
        const res = await $authHost.post('/user/edit', changes);
        return res;
    } catch (error) {
        console.error(error)
    }
}