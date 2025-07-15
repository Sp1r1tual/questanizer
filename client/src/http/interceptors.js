import {
    refreshToken,
    processQueue,
    retryRequestWithNewToken,
} from "./tokenUtils.js";

let failedQueue = [];
let refreshPromise = null;

function setupInterceptors(axiosInstance) {
    axiosInstance.interceptors.request.use((config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            const isUnauthorized = error.response?.status === 401;
            const canRetry = originalRequest && !originalRequest._retry;

            if (!isUnauthorized || !canRetry) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = refreshToken()
                    .then((newToken) => {
                        processQueue(null, newToken, failedQueue);
                        return newToken;
                    })
                    .catch((error) => {
                        processQueue(error, null, failedQueue);
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                        return Promise.reject(error);
                    })
                    .finally(() => {
                        refreshPromise = null;
                    });
            }

            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) =>
                retryRequestWithNewToken(axiosInstance, originalRequest, token)
            );
        }
    );
}

export { setupInterceptors };
