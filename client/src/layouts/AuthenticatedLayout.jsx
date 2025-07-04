import { useSelector } from "react-redux";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

import styles from "./AuthenticatedLayout.module.css";

const AuthenticatedLayout = () => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default AuthenticatedLayout;
