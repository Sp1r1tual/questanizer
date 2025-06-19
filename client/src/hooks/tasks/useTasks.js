import { useTaskState } from "./useTaskState";
import { useTaskModals } from "./useTaskModals";
import { useTaskActions } from "./useTaskActions";
import { useTaskImpacts } from "./useTaskImpacts";

const useTasks = () => {
    const state = useTaskState();
    const modals = useTaskModals(state);
    const actions = useTaskActions(state);
    const effects = useTaskImpacts(state);

    return {
        ...state,
        ...modals,
        ...actions,
        ...effects,
    };
};

export { useTasks };
