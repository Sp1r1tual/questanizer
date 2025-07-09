import axios from "axios";
import { setupInterceptors } from "./interceptors.js";

const API_URL = process.env.REACT_APP_API_URL;

const $api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

setupInterceptors($api);

export { API_URL, $api };
