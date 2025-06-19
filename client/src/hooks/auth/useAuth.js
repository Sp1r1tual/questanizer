import { useSelector, useDispatch } from "react-redux";

import { login, logout } from "../../store/auth/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const signIn = (credentials) => {
        dispatch(login(credentials));
    };

    const signOut = () => {
        dispatch(logout());
    };

    return {
        user,
        isAuthenticated,
        signIn,
        signOut,
    };
};

export default useAuth;
