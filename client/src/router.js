import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./routes/pages/login/LoginPage";
import Dashboard from "./components/ui/Dashboard";
import TasksView from "./components/organizer/TasksView";
import UserStatsView from "./components/stats/UserStatsView";
import BossBattlePage from "./routes/pages/boss/BossBattlePage";
import AnswersPage from "./routes/pages/faq/AnswersPage";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";
import RegistrationPage from "./routes/pages/registration/RegistrationPage";
import VerifyEmailPage from "./routes/pages/verify/VerifyEmailPage";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/registration",
        element: <RegistrationPage />,
    },
    {
        path: "/verify-email",
        element: <VerifyEmailPage />,
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
]);

export default router;
