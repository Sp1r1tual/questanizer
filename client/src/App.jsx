import TaskManager from "./components/organizer/TaskManager";
import { useTasks } from "./hooks/useTasks";

import styles from "./App.module.css";

function App() {
    const taskProps = useTasks();
    return (
        <div className={styles.App}>
            <TaskManager {...taskProps} />
        </div>
    );
}

export default App;
