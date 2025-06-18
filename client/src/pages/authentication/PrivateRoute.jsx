import { useSelector } from "react-redux";

import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    if (!isAuthenticated) {
        return <Navigate to="/authentication" replace />;
    }

    return children;
};

export default PrivateRoute;
