import { Routes, Route } from "react-router-dom";
import AuthenticationPage from "./pages/authentication/AuthenticationPage";
import ProtectedRoutes from "./components/layout/ProtectedRoutes";

function App() {
    return (
        <Routes>
            <Route path="/authentication" element={<AuthenticationPage />} />
            <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
    );
}

export default App;
