import { useSelector, useDispatch } from "react-redux";
import { clearAuthError } from "../../store/auth/authSlice";
import { login, register, logout } from "../../store/auth/authThunks";
import clearAllStateHelper from "../../utils/state/clearAllStateHelper";

const useAuth = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const authError = useSelector((state) => state.auth.error);
    const isAuthChecked = useSelector((state) => state.auth.isAuthChecked);

    const signIn = (credentials) => dispatch(login(credentials));
    const registerUser = (credentials) => dispatch(register(credentials));
    const signOut = () => {
        dispatch(logout());
        clearAllStateHelper(dispatch);
    };
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
