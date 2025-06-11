import { useTasks } from "./hooks/useTasks";

import TaskManager from "./components/organizer/TaskManager";
import Navbar from "./components/layout/Navbar";
import AuthManager from "./components/auth/AuthManager";

import styles from "./App.module.css";

function App() {
    const taskProps = useTasks();

    return (
        <div className={styles.App}>
            <AuthManager>
                {({ onLoginClick }) => <Navbar onLoginClick={onLoginClick} />}
            </AuthManager>
            <main className={styles.mainContent}>
                <TaskManager {...taskProps} />
            </main>
        </div>
    );
}

export default App;
