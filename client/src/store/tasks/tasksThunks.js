import { createAsyncThunk } from "@reduxjs/toolkit";
import { TaskService } from "../../services/tasksService";
import { fetchStats } from "../stats/userStatsThunks";

const fetchTasks = createAsyncThunk("tasks/fetchTasks", async (_, thunkAPI) => {
    try {
        const response = await TaskService.getAllTasks();

        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue("Failed to load tasks");
    }
});

const addTaskAsync = createAsyncThunk(
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

const deleteTaskAsync = createAsyncThunk(
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

const completeTaskAsync = createAsyncThunk(
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

export { fetchTasks, addTaskAsync, deleteTaskAsync, completeTaskAsync };
