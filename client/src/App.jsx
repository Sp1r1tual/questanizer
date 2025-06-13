import { useTasks } from "./hooks/useTasks";

import TaskManager from "./components/organizer/TaskManager";
import Navbar from "./components/layout/Navbar";
import AuthManager from "./components/auth/AuthManager";
import Footer from "./components/layout/Footer";
import Dashboard from "./components/ui/Dashboard";
import UserStatsManager from "./components/stats/UserStatsManager";

import styles from "./App.module.css";

function App() {
    const taskProps = useTasks();

    return (
        <div className={styles.App}>
            <AuthManager>
                {({ onLoginClick }) => <Navbar onLoginClick={onLoginClick} />}
            </AuthManager>
            <main className={styles.mainContent}>
                <Dashboard>
                    <UserStatsManager />
                    <TaskManager {...taskProps} />
                </Dashboard>
                <Footer />
            </main>
        </div>
    );
}

export default App;
