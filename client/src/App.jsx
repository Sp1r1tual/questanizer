import { Routes, Route } from "react-router-dom";
import AuthenticationPage from "./routes/pages/authentication/AuthenticationPage";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";

function App() {
    return (
        <Routes>
            <Route path="/authentication" element={<AuthenticationPage />} />
            <Route path="/*" element={<AuthenticatedLayout />} />
        </Routes>
    );
}

export default App;
