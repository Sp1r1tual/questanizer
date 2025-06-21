import useAuth from "../../auth/useAuth";

import { renderHook, act } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { login, logout } from "../../../store/auth/authSlice";

const mockStore = configureStore([]);

describe("useAuth", () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: {
                user: null,
                isAuthenticated: false,
            },
        });

        store.dispatch = jest.fn();
    });

    const wrapper = ({ children }) => (
        <Provider store={store}>{children}</Provider>
    );

    it("returns user and isAuthenticated", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        expect(result.current.user).toBeNull();
        expect(result.current.isAuthenticated).toBe(false);
    });

    it("will dispatch login upon signIn", () => {
        const credentials = { username: "admin", password: "1234" };
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.signIn(credentials);
        });

        expect(store.dispatch).toHaveBeenCalledWith(login(credentials));
    });

    it("will dispatch logout at signOut", () => {
        const { result } = renderHook(() => useAuth(), { wrapper });

        act(() => {
            result.current.signOut();
        });

        expect(store.dispatch).toHaveBeenCalledWith(logout());
    });
});
