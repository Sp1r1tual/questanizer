import {
    refreshToken,
    processQueue,
    retryRequestWithNewToken,
} from "../utils/tokenUtils.js";

let pendingRequestsQueue = [];
let isRefreshing = false;

function authInterceptors(axiosInstance) {
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

            const isAuthRoute =
                originalRequest?.url?.includes("/login") ||
                originalRequest?.url?.includes("/registration");

            if (!isUnauthorized || !canRetry || isAuthRoute) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newToken = await refreshToken();

                    processQueue(null, newToken, pendingRequestsQueue);
                    isRefreshing = false;

                    return retryRequestWithNewToken(
                        axiosInstance,
                        originalRequest,
                        newToken
                    );
                } catch (error) {
                    processQueue(error, null, pendingRequestsQueue);

                    localStorage.removeItem("token");
                    isRefreshing = false;

                    throw error;
                }
            }

            return new Promise((resolve, reject) => {
                pendingRequestsQueue.push({ resolve, reject });
            }).then((token) =>
                retryRequestWithNewToken(axiosInstance, originalRequest, token)
            );
        }
    );
}

export { authInterceptors };
