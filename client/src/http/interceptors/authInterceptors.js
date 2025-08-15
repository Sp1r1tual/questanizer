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

const authInterceptors = (axiosInstance) => {
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

            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const newToken = await refreshToken();

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    return axiosInstance(originalRequest);
                } catch (error) {
                    localStorage.removeItem("token");

                    return Promise.reject(error);
                }
            }

            return Promise.reject(error);
        }
    );
};

export { authInterceptors, refreshToken };
