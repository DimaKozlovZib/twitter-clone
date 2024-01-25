import { $authHost } from "../../API";

export const addMessages = async (formData) => {
    try {
        const response = await $authHost.post('/message', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        console.log(response)
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
}