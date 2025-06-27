import { useSelector, useDispatch } from "react-redux";
import {
    login,
    register,
    logout,
    clearAuthError,
} from "../../store/auth/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const authError = useSelector((state) => state.auth.error);
    const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

    const signIn = (credentials) => dispatch(login(credentials));
    const registerUser = (credentials) => dispatch(register(credentials));
    const signOut = () => dispatch(logout());
    const clearError = () => dispatch(clearAuthError());

    return {
        user,
        isAuthenticated,
        authError,
        isAuthChecked,
        signIn,
        signOut,
        registerUser,
        clearError,
    };
};

export default useAuth;
