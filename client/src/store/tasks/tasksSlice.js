import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TaskService } from "../../services/tasksService";
import { fetchStats } from "../stats/userStatsSlice";

export const fetchTasks = createAsyncThunk(
    "tasks/fetchTasks",
    async (_, thunkAPI) => {
        try {
            const response = await TaskService.getAllTasks();

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to load tasks");
        }
    }
);

export const addTaskAsync = createAsyncThunk(
    "tasks/addTaskAsync",
    async ({ text, deadline, difficulty }, thunkAPI) => {
        try {
            const response = await TaskService.createTask({
                text,
                deadline,
                difficulty,
            });

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to create task");
        }
    }
);

export const deleteTaskAsync = createAsyncThunk(
    "tasks/deleteTaskAsync",
    async (_id, thunkAPI) => {
        try {
            await TaskService.deleteTask(_id);
            return _id;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to delete task");
        }
    }
);

export const completeTaskAsync = createAsyncThunk(
    "tasks/completeTaskAsync",
    async (_id, thunkAPI) => {
        try {
            const response = await TaskService.completeTask(_id);

            thunkAPI.dispatch(fetchStats());
            return response.data.task;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to perform task");
        }
    }
);

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
            const task = state.tasks.find(
                (task) => task._id === action.payload
            );

            if (task) task.damageTaken = true;
        },
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

                if (index !== -1) state.tasks[index] = action.payload;
                state.confirmModal = initialState.confirmModal;
            });
    },
});

export const {
    setInputTask,
    setModalActive,
    closeModal,
    setDeadline,
    openConfirmModal,
    closeConfirmModal,
    markDamageTaken,
} = tasksSlice.actions;

export default tasksSlice.reducer;
