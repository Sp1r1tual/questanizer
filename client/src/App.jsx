import { Routes, Route } from "react-router-dom";
import AuthenticationPage from "./routes/pages/authentication/AuthenticationPage";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
    return (
        <Routes>
            <Route path="/authentication" element={<AuthenticationPage />} />
            <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
    );
}

export default App;
