import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout";
import { Dashboard } from "./components/ui/wrappers/Dashboard";
import { TasksView } from "./components/organizer/TasksView";
import { UserStatsView } from "./components/stats/UserStatsView";
import { BossBattlePage } from "./pages/BossBattlePage";
import { AnswersPage } from "./pages/AnswersPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { RouteErrorFallback } from "./components/errors/RouteErrorFallback";
import { MarketPage } from "./pages/MarketPage";
import { ContainerMedium } from "./components/ui/wrappers/ContainerMedium";

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
                element: <ForgotPasswordPage />,
            },
            {
                path: "reset-password/:token",
                element: <ResetPasswordPage />,
            },
            {
                path: "/",
                element: <AuthenticatedLayout />,
                children: [
                    {
                        index: true,
                        element: (
                            <Dashboard>
                                <ContainerMedium>
                                    <UserStatsView />
                                </ContainerMedium>
                                <TasksView />
                            </Dashboard>
                        ),
                    },
                    {
                        path: "boss",
                        element: <BossBattlePage />,
                    },
                    {
                        path: "market",
                        element: <MarketPage />,
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
