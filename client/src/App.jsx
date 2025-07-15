import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    return (
        <>
            <Outlet />
            <ToastContainer position="top-right" autoClose={3000} />
        </>
    );
};

export default App;
