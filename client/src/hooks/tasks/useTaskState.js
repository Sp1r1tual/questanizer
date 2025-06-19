import { useSelector, useDispatch } from "react-redux";

const useTaskState = () => {
    const state = useSelector((state) => state.tasks);
    const dispatch = useDispatch();

    return { ...state, dispatch };
};

export { useTaskState };
