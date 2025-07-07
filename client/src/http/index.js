import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

const refreshToken = async () => {
    const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
    });

    const newToken = response.data.accessToken;

    localStorage.setItem("token", newToken);

    $api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

    return newToken;
};

const retryRequestWithNewToken = (originalRequest, token) => {
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return $api(originalRequest);
};

$api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const isUnauthorized = error.response?.status === 401;
        const canRetry = originalRequest && !originalRequest._isRetry;

        if (!isUnauthorized || !canRetry) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) =>
                    retryRequestWithNewToken(originalRequest, token)
                )
                .catch((error) => Promise.reject(error));
        }

        originalRequest._isRetry = true;
        isRefreshing = true;

        try {
            const newToken = await refreshToken();

            processQueue(null, newToken);
            return retryRequestWithNewToken(originalRequest, newToken);
        } catch (refreshError) {
            processQueue(refreshError, null);
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export { API_URL, $api };
