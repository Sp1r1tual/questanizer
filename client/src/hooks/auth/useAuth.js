import { useSelector, useDispatch } from "react-redux";

import { login, register, logout } from "../../store/auth/authSlice";
import { clearError } from "../../store/auth/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const authError = useSelector((state) => state.auth.error);

    const signIn = (credentials) => dispatch(login(credentials));
    const registerUser = (credentials) => dispatch(register(credentials));
    const signOut = () => dispatch(logout());
    const resetError = () => dispatch(clearError());

    return {
        user,
        isAuthenticated,
        authError,
        signIn,
        signOut,
        registerUser,
        resetError,
    };
};

export default useAuth;
