import { useTasks } from "./hooks/useTasks";
import { Routes, Route } from "react-router-dom";

import TasksView from "./components/organizer/TasksView";
import Navbar from "./components/layout/Navbar";
import AuthManager from "./components/auth/AuthManager";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/ui/Dashboard";
import UserStatsView from "./components/stats/UserStatsView";
import BossBattlePage from "./pages/boss/BossBattlePage";
import AnswersPage from "./pages/faq/AnswersPage";

import styles from "./App.module.css";

function App() {
    const taskProps = useTasks();

    return (
        <div className={styles.App}>
            <AuthManager>
                {({ onLoginClick }) => <Navbar onLoginClick={onLoginClick} />}
            </AuthManager>
            <main className={styles.mainContent}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Dashboard>
                                <UserStatsView />
                                <TasksView {...taskProps} />
                            </Dashboard>
                        }
                    />
                    <Route path="/boss" element={<BossBattlePage />} />
                    <Route path="/faq" element={<AnswersPage />} />
                </Routes>
                <Footer />
            </main>
        </div>
    );
}

export default App;
