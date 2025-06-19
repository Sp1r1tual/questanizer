import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <Navigate to="/authentication" replace state={{ from: location }} />
        );
    }

    return children;
};

export default PrivateRoute;
