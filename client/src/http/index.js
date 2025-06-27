import axios from "axios";

const API_URL = "http://localhost:5000/api";

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
});

$api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response.status === 401 &&
            error.config &&
            !error.config._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                const response = await axios.get(`${API_URL}/refresh`, {
                    withCredentials: true,
                });
                localStorage.setItem("token", response.data.accessToken);
                return $api.request(originalRequest);
            } catch (error) {
                console.log("User is not authorized");
            }
        }
        throw error;
    }
);

export { API_URL, $api };
