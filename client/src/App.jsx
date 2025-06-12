import { useTasks } from "./hooks/useTasks";

import TaskManager from "./components/organizer/TaskManager";
import Navbar from "./components/layout/Navbar";
import AuthManager from "./components/auth/AuthManager";
import Footer from "./components/layout/Footer";

import styles from "./App.module.css";
import UserStatsPanel from "./components/layout/UserStatsPanel";

function App() {
    const taskProps = useTasks();

    return (
        <div className={styles.App}>
            <AuthManager>
                {({ onLoginClick }) => <Navbar onLoginClick={onLoginClick} />}
            </AuthManager>
            <main className={styles.mainContent}>
                <div className={styles.dashboard}>
                    <UserStatsPanel />
                    <TaskManager {...taskProps} />
                </div>
                <Footer />
            </main>
        </div>
    );
}

export default App;
