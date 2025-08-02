import { toast } from "react-toastify";

const ALLOWED_NOTIFICATION_ENDPOINTS = [
    "/stats",
    "/tasks",
    "/bosses",
    "/market",
    "/cart",
];

const showMessage = (msg) => {
    if (typeof msg === "string") {
        return toast(msg);
    }

    if (typeof msg === "object" && msg.text) {
        switch (msg.type) {
            case "success":
                toast.success(msg.text);
                break;
            case "error":
                toast.error(msg.text);
                break;
            case "warn":
            case "warning":
                toast.warn(msg.text);
                break;
            case "info":
            default:
                toast.info(msg.text);
        }
    }
};

function shouldShowNotification(config) {
    return ALLOWED_NOTIFICATION_ENDPOINTS.some((endpoint) =>
        config.url?.includes(endpoint)
    );
}

function notificationInterceptor(axiosInstance) {
    axiosInstance.interceptors.response.use(
        (response) => {
            const { message, messages } = response.data;

            if (!shouldShowNotification(response.config)) return response;

            if (Array.isArray(messages)) messages.forEach(showMessage);

            if (message) showMessage(message);

            return response;
        },
        (error) => {
            const errMsg = error.response?.data?.message;

            const status = error.response?.status;
            const url = error.config?.url || "";

            const isNotAuthError = status !== 401 && status !== 403;
            const isAllowed = shouldShowNotification(error.config || { url });

            if (errMsg && isNotAuthError && isAllowed) {
                toast.error(errMsg);
            }

            throw error;
        }
    );
}

export { notificationInterceptor };
