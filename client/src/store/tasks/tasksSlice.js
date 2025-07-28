import { createSlice } from "@reduxjs/toolkit";
import {
    fetchTasks,
    addTaskAsync,
    deleteTaskAsync,
    completeTaskAsync,
} from "./tasksThunks";

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
        },
        setIsInputInvalid: (state, action) => {
            state.isInputInvalid = action.payload;
        },
        setModalActive: (state, action) => {
            state.modalActive = action.payload;
        },
        closeModal: (state) => {
            state.inputTask = "";
            state.deadline = "";
            state.modalActive = false;
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
            const task = state.tasks.find((t) => t._id === action.payload);

            if (task) task.damageTaken = true;
        },
        clearTasksState: () => ({ ...initialState }),
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addTaskAsync.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
                state.inputTask = "";
                state.deadline = "";
                state.modalActive = false;
            })

            .addCase(deleteTaskAsync.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(
                    (task) => task._id !== action.payload
                );
                state.confirmModal = initialState.confirmModal;
            })

            .addCase(completeTaskAsync.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(
                    (task) => task._id === action.payload._id
                );

                if (index !== -1) {
                    state.tasks[index] = action.payload;
                    state.confirmModal = initialState.confirmModal;
                }
            });
    },
});

export const {
    setInputTask,
    setIsInputInvalid,
    setModalActive,
    closeModal,
    setDeadline,
    openConfirmModal,
    closeConfirmModal,
    markDamageTaken,
    clearTasksState,
} = tasksSlice.actions;

export default tasksSlice.reducer;
