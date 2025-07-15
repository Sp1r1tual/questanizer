import axios from "axios";
import { setupInterceptors } from "./interceptors.js";
import { notificationInterceptor } from "./notificationsInterceptor.js";

const API_URL = process.env.REACT_APP_API_URL;

const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

setupInterceptors($api);
notificationInterceptor($api);

export { API_URL, $api };
