import { useSelector, useDispatch } from "react-redux";

import { login, register, logout } from "@/store/auth/authThunks";
import { clearAuthError } from "@/store/auth/authSlice";

import { clearAllState } from "@/utils/state/clearAllState";

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
    clearAllState(dispatch);
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

export { useAuth };
