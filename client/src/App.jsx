import { Routes, Route } from "react-router-dom";

import TasksView from "./components/organizer/TasksView";
import TaskProvider from "./components/organizer/TaskProvider";
import Navbar from "./components/layout/Navbar";
import AuthManager from "./components/auth/AuthManager";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/ui/Dashboard";
import UserStatsView from "./components/stats/UserStatsView";
import BossBattlePage from "./pages/boss/BossBattlePage";
import AnswersPage from "./pages/faq/AnswersPage";

import styles from "./App.module.css";

function App() {
    return (
        <div className={styles.App}>
            <AuthManager>
                <Navbar />
                <main className={styles.mainContent}>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Dashboard>
                                    <TaskProvider>
                                        <UserStatsView />
                                        <TasksView />
                                    </TaskProvider>
                                </Dashboard>
                            }
                        />
                        <Route path="/boss" element={<BossBattlePage />} />
                        <Route path="/faq" element={<AnswersPage />} />
                    </Routes>
                    <Footer />
                </main>
            </AuthManager>
        </div>
    );
}

export default App;
