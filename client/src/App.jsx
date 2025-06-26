import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { checkAuth } from "./store/auth/authSlice";
import router from "./router";

function App() {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.isLoading);

    // TODO: Persist authentication state on page reload
    // Currently, the user is logged out after refreshing the page
    useEffect(() => {
        if (localStorage.getItem("token")) {
            dispatch(checkAuth());
        }
    }, []);

    if (isLoading) return <div>Loading...</div>;

    return <RouterProvider router={router} />;
}

export default App;
