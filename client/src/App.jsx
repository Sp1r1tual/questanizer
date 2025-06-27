import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Outlet } from "react-router-dom";
import { checkAuth } from "./store/auth/authSlice";
import Loader from "./components/ui/Loader";

const App = () => {
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.auth.isLoading);

    useEffect(() => {
        if (localStorage.getItem("token")) {
            dispatch(checkAuth());
        }
    }, [dispatch]);

    if (isLoading) return <Loader visible={true} />;

    return (
        <>
            <Outlet />
        </>
    );
};

export default App;
