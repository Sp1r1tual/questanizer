import { Routes, Route } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Dashboard from "../components/ui/Dashboard";
import TasksView from "../components/organizer/TasksView";
import UserStatsView from "../components/stats/UserStatsView";
import BossBattlePage from "../routes/pages/boss/BossBattlePage";
import AnswersPage from "../routes/pages/faq/AnswersPage";
import PrivateRoute from "./PrivateRoute";

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
