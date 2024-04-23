import axios from "axios";
import { REACT_APP_API_URL } from "../constans";

const $authHost = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_API_URL
})

const $host = axios.create({
    withCredentials: true,
    baseURL: REACT_APP_API_URL
})

const authInterceptor = config => {
    const token = localStorage.getItem('accessToken')
    config.headers.authorization = `Bearer ${token}`
    return config;
}

$authHost.interceptors.request.use(authInterceptor)

export {
    $authHost,
    $host,
}