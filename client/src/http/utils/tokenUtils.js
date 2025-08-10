import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const refreshToken = async () => {
    const response = await axios.get(`${API_URL}/refresh`, {
        withCredentials: true,
    });

    const newToken = response.data.accessToken;

    localStorage.setItem("token", newToken);

    return newToken;
};

const processQueue = (error, token = null, queue) => {
    queue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    queue.length = 0;
};

const retryRequestWithNewToken = (axiosInstance, originalRequest, token) => {
    originalRequest.headers = originalRequest.headers || {};
    originalRequest.headers.Authorization = `Bearer ${token}`;

    return axiosInstance(originalRequest);
};

export { refreshToken, processQueue, retryRequestWithNewToken };
