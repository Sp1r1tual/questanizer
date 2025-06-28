import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./routes/pages/login/LoginPage";
import RegistrationPage from "./routes/pages/registration/RegistrationPage";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import Dashboard from "./components/ui/Dashboard";
import TasksView from "./components/organizer/TasksView";
import UserStatsView from "./components/stats/UserStatsView";
import BossBattlePage from "./routes/pages/boss/BossBattlePage";
import AnswersPage from "./routes/pages/faq/AnswersPage";
import ForgotPassword from "./routes/pages/forgot-password/ForgotPassword";
import ResetPassword from "./routes/pages/reset-password/ResetPassword";

const router = createBrowserRouter([
    {
        path: "",
        element: <App />,
        children: [
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "registration",
                element: <RegistrationPage />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "reset-password/:token",
                element: <ResetPassword />,
            },
            {
                path: "/",
                element: <AuthenticatedLayout />,
                children: [
                    {
                        index: true,
                        element: (
                            <Dashboard>
                                <UserStatsView />
                                <TasksView />
                            </Dashboard>
                        ),
                    },
                    {
                        path: "boss",
                        element: <BossBattlePage />,
                    },
                    {
                        path: "faq",
                        element: <AnswersPage />,
                    },
                ],
            },
        ],
    },
]);

export default router;
