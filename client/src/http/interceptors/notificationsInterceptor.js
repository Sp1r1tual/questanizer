import { toast } from "react-toastify";

const showMessage = (msg) => {
    if (typeof msg === "string") {
        toast(msg);
    } else if (typeof msg === "object" && msg.text) {
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

function notificationInterceptor(axiosInstance) {
    axiosInstance.interceptors.response.use(
        (response) => {
            const { message, messages } = response.data;

            if (Array.isArray(messages)) {
                messages.forEach(showMessage);
            } else if (message) {
                showMessage(message);
            }

            return response;
        },
        (error) => {
            const errMsg = error.response?.data?.message;

            if (errMsg) toast.error(errMsg);

            return Promise.reject(error);
        }
    );
}

export { notificationInterceptor };
