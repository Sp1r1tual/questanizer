import { useDispatch, useSelector } from "react-redux";
import useAuth from "../../../hooks/auth/useAuth";

import { renderHook } from "@testing-library/react";
import { clearAuthError } from "../../../store/auth/authSlice";
import { login, register, logout } from "../../../store/auth/authThunks";
import clearAllStateHelper from "../../../utils/state/clearAllStateHelper";

jest.mock("react-redux", () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock("../../../store/auth/authSlice", () => ({
    clearAuthError: jest.fn(() => ({ type: "auth/clearError" })),
}));

jest.mock("../../../store/auth/authThunks", () => ({
    login: jest.fn((creds) => ({ type: "auth/login", payload: creds })),
    register: jest.fn((creds) => ({ type: "auth/register", payload: creds })),
    logout: jest.fn(() => ({ type: "auth/logout" })),
}));

jest.mock("../../../utils/state/clearAllStateHelper", () => jest.fn());

describe("useAuth hook", () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useDispatch.mockReturnValue(mockDispatch);
    });

    it("returns state slices from useSelector", () => {
        useSelector.mockImplementation((selectorFn) => {
            if (selectorFn.toString().includes("state.auth.user"))
                return { id: "user1" };
            if (selectorFn.toString().includes("state.auth.isAuthenticated"))
                return true;
            if (selectorFn.toString().includes("state.auth.error"))
                return "some error";
            if (selectorFn.toString().includes("state.auth.isAuthChecked"))
                return true;
            return undefined;
        });

        const { result } = renderHook(() => useAuth());

        expect(result.current.user).toEqual({ id: "user1" });
        expect(result.current.isAuthenticated).toBe(true);
        expect(result.current.authError).toBe("some error");
        expect(result.current.isAuthChecked).toBe(true);
    });

    it("signIn dispatches login thunk with credentials", () => {
        useSelector.mockReturnValue(null);

        const { result } = renderHook(() => useAuth());

        const credentials = { username: "test", password: "pass" };

        result.current.signIn(credentials);

        expect(login).toHaveBeenCalledWith(credentials);
        expect(mockDispatch).toHaveBeenCalledWith(login.mock.results[0].value);
    });

    it("registerUser dispatches register thunk with credentials", () => {
        useSelector.mockReturnValue(null);

        const { result } = renderHook(() => useAuth());

        const credentials = { username: "newuser", password: "1234" };

        result.current.registerUser(credentials);

        expect(register).toHaveBeenCalledWith(credentials);
        expect(mockDispatch).toHaveBeenCalledWith(
            register.mock.results[0].value
        );
    });

    it("signOut dispatches logout thunk and calls clearAllStateHelper", () => {
        useSelector.mockReturnValue(null);

        const { result } = renderHook(() => useAuth());

        result.current.signOut();

        expect(logout).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(logout.mock.results[0].value);
        expect(clearAllStateHelper).toHaveBeenCalledWith(mockDispatch);
    });

    it("clearError dispatches clearAuthError action", () => {
        useSelector.mockReturnValue(null);

        const { result } = renderHook(() => useAuth());

        result.current.clearError();

        expect(clearAuthError).toHaveBeenCalled();
        expect(mockDispatch).toHaveBeenCalledWith(
            clearAuthError.mock.results[0].value
        );
    });
});
