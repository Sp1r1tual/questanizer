import { createBrowserRouter } from "react-router-dom";

import { App } from "./App";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout";

import { RouteErrorFallback } from "./components/errors/RouteErrorFallback";

import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { BossBattlePage } from "./pages/BossBattlePage";
import { AnswersPage } from "./pages/AnswersPage";
import { MarketPage } from "./pages/MarketPage";
import { InventoryPage } from "./pages/InventoryPage";
import { TasksPage } from "./pages/TasksPage";

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
                        path: "/",
                        element: <TasksPage />,
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
