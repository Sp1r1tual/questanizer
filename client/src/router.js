import { createBrowserRouter } from "react-router-dom";
import AuthenticationPage from "./routes/pages/authentication/AuthenticationPage";
import Dashboard from "./components/ui/Dashboard";
import TasksView from "./components/organizer/TasksView";
import UserStatsView from "./components/stats/UserStatsView";
import BossBattlePage from "./routes/pages/boss/BossBattlePage";
import AnswersPage from "./routes/pages/faq/AnswersPage";
import AuthenticatedLayout from "./layouts/AuthenticatedLayout";

const router = createBrowserRouter([
    {
        path: "/login",
        element: <AuthenticationPage />,
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
