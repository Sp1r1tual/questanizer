import { notificationInterceptor } from "../../http/interceptors/notificationsInterceptor";
import { toast } from "react-toastify";

jest.mock("react-toastify");

describe("notificationInterceptor", () => {
    let axiosMock;

    beforeEach(() => {
        jest.clearAllMocks();

        axiosMock = {
            interceptors: {
                response: {
                    use: jest.fn((successCb, errorCb) => {
                        axiosMock._success = successCb;
                        axiosMock._error = errorCb;
                    }),
                },
            },
        };
    });

    it("calls toast.success/info/warn/error based on response messages array", async () => {
        notificationInterceptor(axiosMock);

        const mockResponse = {
            data: {
                messages: [
                    { type: "success", text: "Success message" },
                    { type: "error", text: "Error occurred" },
                    { type: "warning", text: "This is a warning" },
                    { type: "info", text: "Some info" },
                    { type: "unknown", text: "Should use info by default" },
                ],
            },
        };

        await axiosMock._success(mockResponse);

        expect(toast.success).toHaveBeenCalledWith("Success message");
        expect(toast.error).toHaveBeenCalledWith("Error occurred");
        expect(toast.warn).toHaveBeenCalledWith("This is a warning");
        expect(toast.info).toHaveBeenCalledWith("Some info");
        expect(toast.info).toHaveBeenCalledWith("Should use info by default");
    });

    it("calls toast with simple message string", async () => {
        notificationInterceptor(axiosMock);

        const mockResponse = {
            data: {
                message: "Simple string message",
            },
        };

        await axiosMock._success(mockResponse);

        expect(toast).toHaveBeenCalledWith("Simple string message");
    });

    it("does nothing if response has no message", async () => {
        notificationInterceptor(axiosMock);

        const mockResponse = { data: {} };

        await axiosMock._success(mockResponse);

        expect(toast).not.toHaveBeenCalled();
    });

    it("calls toast.error on error with message in response", async () => {
        notificationInterceptor(axiosMock);

        const error = {
            response: {
                data: {
                    message: "Something went wrong",
                },
            },
        };

        await expect(axiosMock._error(error)).rejects.toBe(error);

        expect(toast.error).toHaveBeenCalledWith("Something went wrong");
    });

    it("does not call toast if error has no response message", async () => {
        notificationInterceptor(axiosMock);

        const error = {
            response: {
                data: {},
            },
        };

        await expect(axiosMock._error(error)).rejects.toBe(error);

        expect(toast.error).not.toHaveBeenCalled();
    });
});
