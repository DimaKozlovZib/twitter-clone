import axios from "axios";
import { REACT_APP_API_URL } from "./constants";

const $host = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_API_URL
})

const $authHost = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_API_URL
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('accessToken')}`;
    return config;
}

async function updateTokens(error) {
    try {
        const request = error.config;
        const responseGetToken = await $host.get('/user/auth');
        localStorage.setItem('accessToken', responseGetToken.data.accessToken)
        return $authHost.request(request);
    } catch (error) {
        console.error('не авторизован')
    }

}

$authHost.interceptors.response.use((config) => config,
    async (error) => {
        if (error.response.status === 401) {
            updateTokens(error)
        }
    })
$authHost.interceptors.request.use(authInterceptor)

export {
    $authHost,
    $host,
    updateTokens
}