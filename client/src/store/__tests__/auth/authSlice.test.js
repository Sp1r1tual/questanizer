import authReducer, { login, logout } from "../../auth/authSlice";

describe("authSlice", () => {
    const initialState = {
        user: null,
        isAuthenticated: false,
    };

    it("must return the initial state when an undefined state is passed", () => {
        expect(authReducer(undefined, { type: "UNKNOWN_ACTION" })).toEqual(
            initialState
        );
    });

    it("should handle the login action correctly", () => {
        const userPayload = {
            id: 1,
            name: "Andrii Zub",
            email: "andriy_test@gmail.com",
        };
        const expectedState = {
            user: userPayload,
            isAuthenticated: true,
        };

        expect(authReducer(initialState, login(userPayload))).toEqual(
            expectedState
        );
    });

    it("should handle the logout action correctly", () => {
        const loggedInState = {
            user: { id: 1, name: "Andrii Zub", email: "andriy_test@gmail.com" },
            isAuthenticated: true,
        };
        const expectedState = {
            user: null,
            isAuthenticated: false,
        };

        expect(authReducer(loggedInState, logout())).toEqual(expectedState);
    });

    it("logout should reset the state even if user is already null", () => {
        const initialStateWithNullUser = {
            user: null,
            isAuthenticated: true,
        };
        const expectedState = {
            user: null,
            isAuthenticated: false,
        };

        expect(authReducer(initialStateWithNullUser, logout())).toEqual(
            expectedState
        );
    });
});
