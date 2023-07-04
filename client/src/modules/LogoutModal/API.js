import { $authHost } from "../../API";

export const logout = () => {
    try {
        const response = $authHost.post('/user/logout');
        return response;
    } catch (error) {
        console.error(error)
    }
}