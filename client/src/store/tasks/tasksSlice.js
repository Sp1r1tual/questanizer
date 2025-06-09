import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    inputTask: "",
    isInputInvalid: false,
    modalActive: false,
    deadline: "",
};

const tasksSlice = createSlice({
    name: "tasks",
    initialState,
    reducers: {
        setInputTask: (state, action) => {
            state.inputTask = action.payload;
            state.isInputInvalid = action.payload.trim() === "";
        },
        setModalActive: (state, action) => {
            state.modalActive = action.payload;
        },
        addTask: (state, action) => {
            if (action.payload.withDeadline && !state.deadline) return;
            state.tasks.push({
                id: crypto.randomUUID(),
                text: state.inputTask,
                createdAt: new Date().toLocaleString(),
                isCompleted: false,
                deadline: action.payload.withDeadline ? state.deadline : null,
            });
            state.inputTask = "";
            state.deadline = "";
            state.modalActive = false;
        },
        closeModal: (state) => {
            state.inputTask = "";
            state.deadline = "";
            state.modalActive = false;
        },
        deleteTask: (state, action) => {
            state.tasks = state.tasks.filter(
                (task) => task.id !== action.payload
            );
        },
        completeTask: (state, action) => {
            const task = state.tasks.find((t) => t.id === action.payload);
            if (task) task.isCompleted = !task.isCompleted;
        },
        setDeadline: (state, action) => {
            state.deadline = action.payload;
        },
    },
});

export const {
    setInputTask,
    setModalActive,
    addTask,
    closeModal,
    deleteTask,
    completeTask,
    setDeadline,
} = tasksSlice.actions;

export default tasksSlice.reducer;
