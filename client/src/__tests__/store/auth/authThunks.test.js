import axios from "axios";
import {
    login,
    register,
    logout,
    checkAuth,
} from "../../../store/auth/authThunks";
import { AuthService } from "../../../services/authService";

jest.mock("../../../services/authService");
jest.mock("axios");

jest.mock("../../../http", () => ({
    $api: {
        interceptors: {
            request: { use: jest.fn() },
            response: { use: jest.fn() },
        },
        post: jest.fn(),
    },
}));

describe("auth thunks", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    describe("login", () => {
        it("dispatches fulfilled action and saves token", async () => {
            const fakeUser = { id: "1", email: "test@test.com" };
            const fakeToken = "token123";

            AuthService.login.mockResolvedValueOnce({
                data: { user: fakeUser, accessToken: fakeToken },
            });

            const dispatch = jest.fn();
            const getState = jest.fn();

            const result = await login({
                email: "test@test.com",
                password: "pass",
            })(dispatch, getState, undefined);

            expect(AuthService.login).toHaveBeenCalledWith(
                "test@test.com",
                "pass"
            );
            expect(localStorage.getItem("token")).toBe(fakeToken);
            expect(result.payload).toEqual(fakeUser);
            expect(result.type).toBe("auth/login/fulfilled");
        });

        it("dispatches rejected action on failure", async () => {
            const errorMessage = "Invalid credentials";

            AuthService.login.mockRejectedValueOnce({
                response: { data: { message: errorMessage } },
            });

            const dispatch = jest.fn();
            const getState = jest.fn();

            const thunkAPI = { rejectWithValue: jest.fn((v) => v) };
            const result = await login({
                email: "test@test.com",
                password: "wrong",
            })(dispatch, getState, thunkAPI);

            expect(AuthService.login).toHaveBeenCalled();
            expect(result.payload).toBe(errorMessage);
            expect(result.type).toBe("auth/login/rejected");
        });
    });

    describe("register", () => {
        it("dispatches fulfilled action and saves token", async () => {
            const fakeUser = { id: "1", email: "new@test.com" };
            const fakeToken = "regtoken123";

            AuthService.registration.mockResolvedValueOnce({
                data: { user: fakeUser, accessToken: fakeToken },
            });

            const dispatch = jest.fn();
            const getState = jest.fn();

            const result = await register({
                email: "new@test.com",
                password: "pass",
            })(dispatch, getState, undefined);

            expect(AuthService.registration).toHaveBeenCalledWith(
                "new@test.com",
                "pass"
            );
            expect(localStorage.getItem("token")).toBe(fakeToken);
            expect(result.payload).toEqual(fakeUser);
            expect(result.type).toBe("auth/register/fulfilled");
        });

        it("dispatches rejected action on failure", async () => {
            const errorMessage = "Email already used";
            AuthService.registration.mockRejectedValueOnce({
                response: { data: { message: errorMessage } },
            });

            const dispatch = jest.fn();
            const getState = jest.fn();

            const thunkAPI = { rejectWithValue: jest.fn((v) => v) };
            const result = await register({
                email: "new@test.com",
                password: "pass",
            })(dispatch, getState, thunkAPI);

            expect(AuthService.registration).toHaveBeenCalled();
            expect(result.payload).toBe(errorMessage);
            expect(result.type).toBe("auth/register/rejected");
        });
    });

    describe("logout", () => {
        it("calls AuthService.logout and removes token", async () => {
            AuthService.logout.mockResolvedValueOnce();

            localStorage.setItem("token", "todelete");

            const dispatch = jest.fn();
            const getState = jest.fn();

            await logout()(dispatch, getState, undefined);

            expect(AuthService.logout).toHaveBeenCalled();
            expect(localStorage.getItem("token")).toBeNull();
        });
    });

    describe("checkAuth", () => {
        it("dispatches fulfilled action and saves token", async () => {
            const fakeUser = { id: "1", email: "user@test.com" };
            const fakeToken = "refreshtoken123";
            axios.get.mockResolvedValueOnce({
                data: { user: fakeUser, accessToken: fakeToken },
            });

            const dispatch = jest.fn();
            const getState = jest.fn();

            const result = await checkAuth()(dispatch, getState, undefined);

            expect(axios.get).toHaveBeenCalledWith(
                expect.stringContaining("/refresh"),
                { withCredentials: true }
            );
            expect(localStorage.getItem("token")).toBe(fakeToken);
            expect(result.payload).toEqual(fakeUser);
            expect(result.type).toBe("auth/checkAuth/fulfilled");
        });

        it("dispatches rejected action on failure", async () => {
            const errorMessage = "Session expired";

            axios.get.mockRejectedValueOnce({
                response: { data: { message: errorMessage } },
            });

            const dispatch = jest.fn();
            const getState = jest.fn();

            const thunkAPI = { rejectWithValue: jest.fn((v) => v) };
            const result = await checkAuth()(dispatch, getState, thunkAPI);

            expect(axios.get).toHaveBeenCalled();
            expect(result.payload).toBe(errorMessage);
            expect(result.type).toBe("auth/checkAuth/rejected");
        });
    });
});
