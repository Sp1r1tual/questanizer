import { useSelector, useDispatch } from "react-redux";

import {
    setInputTask,
    setModalActive,
    addTask,
    closeModal,
    deleteTask,
    completeTask,
    setDeadline,
} from "../store/tasks/tasksSlice";

function useTasks() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.tasks);

    return {
        ...state,

        onInputChange: (value) => dispatch(setInputTask(value)),

        onOpenModal: () => {
            if (state.inputTask.trim()) {
                dispatch(setModalActive(true));
            } else {
                dispatch(setInputTask(state.inputTask));
            }
        },

        onAddTask: ({ hasDeadline, difficulty }) => {
            dispatch(addTask({ hasDeadline, difficulty }));
        },

        onCloseModal: () => dispatch(closeModal()),

        onDeleteTask: (id) => dispatch(deleteTask(id)),

        onCompleteTask: (id) => dispatch(completeTask(id)),

        onSetDeadline: (dateStr) => dispatch(setDeadline(dateStr)),
    };
}

export { useTasks };
