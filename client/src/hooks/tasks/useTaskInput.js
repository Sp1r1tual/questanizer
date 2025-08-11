import { useDispatch, useSelector } from "react-redux";

import {
    setInputTask,
    setDeadline,
    setIsInputInvalid,
} from "@/store/tasks/tasksSlice";

const useTaskInput = () => {
    const dispatch = useDispatch();

    const { inputTask, deadline, isInputInvalid } = useSelector(
        (state) => state.tasks
    );

    const onInputChange = (value) => {
        dispatch(setInputTask(value));

        if (isInputInvalid && value.trim() !== "") {
            dispatch(setIsInputInvalid(false));
        }
    };

    const onSetDeadline = (dateStr) => dispatch(setDeadline(dateStr));

    return {
        inputTask,
        deadline,
        isInputInvalid,
        onInputChange,
        onSetDeadline,
    };
};

export { useTaskInput };
