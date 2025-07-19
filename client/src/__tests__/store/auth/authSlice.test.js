import reducer, {
    clearAuthError,
    setIsAuthenticated,
    setAuthChecked,
} from "../../../store/auth/authSlice";

import {
    login,
    register,
    logout,
    checkAuth,
} from "../../../store/auth/authThunks";

const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isAuthChecked: false,
};

describe("authSlice", () => {
    it("should return the initial state", () => {
        expect(reducer(undefined, {})).toEqual(initialState);
    });

    describe("reducers", () => {
        it("clearAuthError should reset error", () => {
            const state = { ...initialState, error: "Some error" };

            expect(reducer(state, clearAuthError()).error).toBeNull();
        });

        it("setIsAuthenticated should set auth state", () => {
            const action = setIsAuthenticated(true);
            const state = reducer(initialState, action);

            expect(state.isAuthenticated).toBe(true);
        });

        it("setAuthChecked should set isAuthChecked", () => {
            const action = setAuthChecked(true);
            const state = reducer(initialState, action);

            expect(state.isAuthChecked).toBe(true);
        });
    });

    describe("extraReducers - login", () => {
        it("should handle login.pending", () => {
            const action = { type: login.pending.type };
            const state = reducer(initialState, action);

            expect(state.isLoading).toBe(true);
            expect(state.error).toBeNull();
        });

        it("should handle login.fulfilled", () => {
            const user = { id: 1, email: "test@example.com" };
            const action = { type: login.fulfilled.type, payload: user };
            const state = reducer(initialState, action);

            expect(state.user).toEqual(user);
            expect(state.isAuthenticated).toBe(true);
            expect(state.isLoading).toBe(false);
            expect(state.isAuthChecked).toBe(true);
            expect(state.error).toBeNull();
        });

        it("should handle login.rejected", () => {
            const error = "Login failed";
            const action = { type: login.rejected.type, payload: error };
            const state = reducer(initialState, action);

            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isLoading).toBe(false);
            expect(state.error).toBe(error);
            expect(state.isAuthChecked).toBe(true);
        });
    });

    describe("extraReducers - register", () => {
        it("should handle register.fulfilled", () => {
            const user = { id: 2, email: "new@example.com" };
            const action = { type: register.fulfilled.type, payload: user };
            const state = reducer(initialState, action);

            expect(state.user).toEqual(user);
            expect(state.isAuthenticated).toBe(true);
        });
    });

    describe("extraReducers - logout", () => {
        it("should handle logout.fulfilled", () => {
            const loggedInState = {
                ...initialState,
                user: { id: 3 },
                isAuthenticated: true,
            };
            const action = { type: logout.fulfilled.type };
            const state = reducer(loggedInState, action);

            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.isAuthChecked).toBe(true);
        });
    });

    describe("extraReducers - checkAuth", () => {
        it("should handle checkAuth.fulfilled", () => {
            const user = { id: 4, name: "Jane" };
            const action = { type: checkAuth.fulfilled.type, payload: user };
            const state = reducer(initialState, action);

            expect(state.user).toEqual(user);
            expect(state.isAuthenticated).toBe(true);
            expect(state.isAuthChecked).toBe(true);
        });

        it("should handle checkAuth.rejected", () => {
            const action = {
                type: checkAuth.rejected.type,
                payload: "Unauthorized",
            };
            const state = reducer(initialState, action);

            expect(state.user).toBeNull();
            expect(state.isAuthenticated).toBe(false);
            expect(state.error).toBe("Unauthorized");
        });
    });
});
