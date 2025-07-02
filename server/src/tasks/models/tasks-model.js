import { Schema, model } from "mongoose";

const taskSchema = new Schema({
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
    isCompleted: { type: Boolean, default: false },
    deadline: { type: Date, default: null },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard", "critical"],
        default: null,
        required: true,
    },
    damageTaken: { type: Boolean, default: false },
});

const TaskModel = model("Task", taskSchema);

export default TaskModel;
