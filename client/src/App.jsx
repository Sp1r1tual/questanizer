import { Routes, Route } from "react-router-dom";

import TasksView from "./components/organizer/TasksView";
import TaskProvider from "./components/organizer/TaskProvider";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/ui/Dashboard";
import UserStatsView from "./components/stats/UserStatsView";
import BossBattlePage from "./pages/boss/BossBattlePage";
import AnswersPage from "./pages/faq/AnswersPage";
import AuthenticationPage from "./pages/authentication/AuthenticationPage";
import PrivateRoute from "./pages/authentication/PrivateRoute";

import styles from "./App.module.css";

function App() {
    return (
        <div className={styles.App}>
            <Routes>
                <Route
                    path="/authentication"
                    element={<AuthenticationPage />}
                />
                <Route
                    path="*"
                    element={
                        <>
                            <Navbar />
                            <main className={styles.mainContent}>
                                <Routes>
                                    <Route
                                        path="/"
                                        element={
                                            <PrivateRoute>
                                                <Dashboard>
                                                    <TaskProvider>
                                                        <UserStatsView />
                                                        <TasksView />
                                                    </TaskProvider>
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
                                <Footer />
                            </main>
                        </>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;
