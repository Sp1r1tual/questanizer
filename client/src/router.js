import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { LoginPage } from "./pages/login/LoginPage";
import { RegistrationPage } from "./pages/registration/RegistrationPage";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout";
import { Dashboard } from "./components/ui/wrappers/Dashboard";
import { TasksView } from "./components/organizer/TasksView";
import { UserStatsView } from "./components/stats/UserStatsView";
import { BossBattlePage } from "./pages/boss/BossBattlePage";
import { AnswersPage } from "./pages/faq/AnswersPage";
import { ForgotPassword } from "./pages/forgot-password/ForgotPassword";
import { ResetPassword } from "./pages/reset-password/ResetPassword";
import { RouteErrorFallback } from "./components/errors/RouteErrorFallback";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <RouteErrorFallback />,
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

export { router };
