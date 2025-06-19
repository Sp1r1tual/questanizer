import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Dashboard from "../ui/Dashboard";
import TasksView from "../organizer/TasksView";
import UserStatsView from "../stats/UserStatsView";
import BossBattlePage from "../../pages/boss/BossBattlePage";
import AnswersPage from "../../pages/faq/AnswersPage";
import PrivateRoute from "../../pages/authentication/PrivateRoute";

import styles from "./ProtectedRoutes.module.css";

function ProtectedRoutes() {
    return (
        <div className={styles.page}>
            <Navbar />
            <main className={styles.mainContent}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard>
                                    <UserStatsView />
                                    <TasksView />
                                </Dashboard>
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/boss"
                        element={
                            <PrivateRoute>
                                <BossBattlePage />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/faq"
                        element={
                            <PrivateRoute>
                                <AnswersPage />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default ProtectedRoutes;
