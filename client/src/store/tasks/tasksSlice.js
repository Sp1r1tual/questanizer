import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    inputTask: "",
    isInputInvalid: false,
    modalActive: false,
    deadline: "",
    confirmModal: {
        isOpen: false,
        actionType: null,
        taskId: null,
        taskText: "",
    },
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
            const { hasDeadline, difficulty } = action.payload;

            if (hasDeadline && !state.deadline) return;

            state.tasks.push({
                id: crypto.randomUUID(),
                text: state.inputTask,
                createdAt: new Date().toLocaleString(),
                isCompleted: false,
                deadline: hasDeadline ? state.deadline : null,
                difficulty: difficulty || null,
                damageTaken: false,
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
            state.confirmModal = {
                isOpen: false,
                actionType: null,
                taskId: null,
                taskText: "",
            };
        },
        completeTask: (state, action) => {
            const task = state.tasks.find((t) => t.id === action.payload);

            if (task) task.isCompleted = !task.isCompleted;
            state.confirmModal = {
                isOpen: false,
                actionType: null,
                taskId: null,
                taskText: "",
            };
        },
        setDeadline: (state, action) => {
            state.deadline = action.payload;
        },
        openConfirmModal: (state, action) => {
            const { actionType, taskId, taskText } = action.payload;

            state.confirmModal = {
                isOpen: true,
                actionType,
                taskId,
                taskText,
            };
        },
        closeConfirmModal: (state) => {
            state.confirmModal = {
                isOpen: false,
                actionType: null,
                taskId: null,
                taskText: "",
            };
        },
        markDamageTaken: (state, action) => {
            const task = state.tasks.find((t) => t.id === action.payload);

            if (task) {
                task.damageTaken = true;
            }
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
    openConfirmModal,
    closeConfirmModal,
    markDamageTaken,
} = tasksSlice.actions;

export default tasksSlice.reducer;
