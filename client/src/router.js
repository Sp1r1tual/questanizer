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
import { InventoryPage } from "./pages/InventoryPage";
import { ContainerMedium } from "./components/ui/wrappers/ContainerMedium";
import { Wrapper } from "./components/ui/wrappers/Wrapper";

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
                            <Wrapper>
                                <Dashboard>
                                    <ContainerMedium>
                                        <UserStatsView />
                                    </ContainerMedium>
                                    <TasksView />
                                </Dashboard>
                            </Wrapper>
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
                        path: "inventory",
                        element: <InventoryPage />,
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
