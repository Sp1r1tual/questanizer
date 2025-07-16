import {
    refreshToken,
    processQueue,
    retryRequestWithNewToken,
} from "../utils/tokenUtils.js";

let failedQueue = [];
let isRefreshing = false;

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

            if (!isRefreshing) {
                isRefreshing = true;

                refreshToken()
                    .then((newToken) => {
                        processQueue(null, newToken, failedQueue);
                    })
                    .catch((err) => {
                        processQueue(err, null, failedQueue);
                        localStorage.removeItem("token");
                        window.location.href = "/login";
                    })
                    .finally(() => {
                        isRefreshing = false;
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
