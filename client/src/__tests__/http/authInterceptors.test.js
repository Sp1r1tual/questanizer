import { authInterceptors } from "../../http/interceptors/authInterceptors";
import {
    refreshToken,
    processQueue,
    retryRequestWithNewToken,
} from "../../http/utils/tokenUtils";

jest.mock("../../http/utils/tokenUtils", () => ({
    refreshToken: jest.fn(() => Promise.resolve("new-token-xyz")),
    processQueue: jest.fn(),
    retryRequestWithNewToken: jest.fn((axios, req, token) => {
        req.headers = req.headers || {};
        req.headers.Authorization = `Bearer ${token}`;
        return Promise.resolve("mocked retry result");
    }),
}));

describe("authInterceptors", () => {
    let axiosMock;
    const originalLocation = window.location;

    beforeEach(() => {
        jest.clearAllMocks();

        delete window.location;
        window.location = { href: "" };

        jest.spyOn(Storage.prototype, "removeItem");

        refreshToken.mockImplementation(() => Promise.resolve("new-token-xyz"));
        processQueue.mockImplementation(() => {});
        retryRequestWithNewToken.mockImplementation((axios, req, token) => {
            req.headers = req.headers || {};
            req.headers.Authorization = `Bearer ${token}`;
            return Promise.resolve("mocked retry result");
        });

        axiosMock = {
            interceptors: {
                request: { use: jest.fn((cb) => cb) },
                response: {
                    use: jest.fn((successCb, errorCb) => {
                        axiosMock._success = successCb;
                        axiosMock._error = errorCb;
                    }),
                },
            },
        };

        authInterceptors(axiosMock);
    });

    afterEach(() => {
        window.location = originalLocation;
        jest.restoreAllMocks();
    });

    it("adds Authorization header if token exists", () => {
        localStorage.setItem("token", "abc123");

        const config = { headers: {} };
        const reqInterceptor =
            axiosMock.interceptors.request.use.mock.calls[0][0];
        const result = reqInterceptor(config);

        expect(result.headers.Authorization).toBe("Bearer abc123");
    });

    it("creates headers if not provided and adds Authorization", () => {
        localStorage.setItem("token", "abc123");

        const config = {};
        const reqInterceptor =
            axiosMock.interceptors.request.use.mock.calls[0][0];
        const result = reqInterceptor(config);

        expect(result.headers.Authorization).toBe("Bearer abc123");
    });

    it("passes through non-401 errors without retrying", async () => {
        const error = { response: { status: 500 } };
        await expect(axiosMock._error(error)).rejects.toBe(error);

        expect(refreshToken).not.toHaveBeenCalled();
    });

    it("passes through 401 errors if already retried", async () => {
        const error = { response: { status: 401 }, config: { _retry: true } };

        await expect(axiosMock._error(error)).rejects.toBe(error);
        expect(refreshToken).not.toHaveBeenCalled();
    });

    describe("when receiving 401 and retry is allowed", () => {
        let originalRequest;
        let error;

        beforeEach(() => {
            originalRequest = { _retry: false, headers: {} };
            error = { response: { status: 401 }, config: originalRequest };
        });

        it("calls refreshToken once and retries request with new token", async () => {
            processQueue.mockImplementation((err, token, queue) => {
                queue.forEach(({ resolve }) => resolve(token));
            });

            const promise = axiosMock._error(error);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(refreshToken).toHaveBeenCalledTimes(1);

            const result = await promise;

            expect(processQueue).toHaveBeenCalledWith(
                null,
                "new-token-xyz",
                expect.any(Array)
            );
            expect(retryRequestWithNewToken).toHaveBeenCalledWith(
                axiosMock,
                originalRequest,
                "new-token-xyz"
            );
            expect(result).toBe("mocked retry result");
        });

        it("queues multiple requests during refresh and resolves them all", async () => {
            let resolveRefreshToken;

            refreshToken.mockImplementation(() => {
                return new Promise((resolve) => {
                    resolveRefreshToken = resolve;
                });
            });

            processQueue.mockImplementation((err, token, queue) => {
                queue.forEach(({ resolve }) => resolve(token));
            });

            const error1 = {
                response: { status: 401 },
                config: { _retry: false, headers: {} },
            };
            const error2 = {
                response: { status: 401 },
                config: { _retry: false, headers: {} },
            };

            const promise1 = axiosMock._error(error1);
            const promise2 = axiosMock._error(error2);

            await new Promise((resolve) => setTimeout(resolve, 0));

            expect(refreshToken).toHaveBeenCalledTimes(1);

            resolveRefreshToken("new-token-xyz");

            const results = await Promise.all([promise1, promise2]);

            expect(results).toEqual([
                "mocked retry result",
                "mocked retry result",
            ]);
            expect(processQueue).toHaveBeenCalledTimes(1);
        });

        it("rejects queued requests and redirects on refreshToken failure", async () => {
            const refreshError = new Error("Refresh failed");

            refreshToken.mockRejectedValueOnce(refreshError);

            processQueue.mockImplementation((err, token, queue) => {
                if (err) {
                    queue.forEach(({ reject }) => reject(err));
                }
            });

            jest.spyOn(Storage.prototype, "removeItem");
            delete window.location;
            window.location = { href: "" };

            const promise = axiosMock._error(error);

            await expect(promise).rejects.toThrow("Refresh failed");

            expect(localStorage.removeItem).toHaveBeenCalledWith("token");
            expect(window.location.href).toBe("/login");
        });

        it("rejects queued requests and redirects on refreshToken failure", async () => {
            const refreshError = new Error("Refresh failed");

            refreshToken.mockRejectedValueOnce(refreshError);

            processQueue.mockImplementation((err, token, queue) => {
                if (err) {
                    queue.forEach(({ reject }) => reject(err));
                }
            });

            const promise = axiosMock._error(error);

            await promise.catch(() => {});

            expect(localStorage.removeItem).toHaveBeenCalledWith("token");
            expect(window.location.href).toBe("/login");

            await expect(promise).rejects.toThrow("Refresh failed");
        });
    });

    it("returns a pending Promise when token is refreshing", () => {
        refreshToken.mockImplementation(() => new Promise(() => {}));

        const originalRequest = { _retry: false, headers: {} };
        const error = { response: { status: 401 }, config: originalRequest };

        const retryPromise = axiosMock._error(error);

        expect(refreshToken).toHaveBeenCalledTimes(1);
        expect(typeof retryPromise.then).toBe("function");
    });
});
