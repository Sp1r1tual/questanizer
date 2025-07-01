import { $api } from "../http";

class TaskService {
    static async getAllTasks() {
        return $api.get("/tasks");
    }

    static async createTask(data) {
        return $api.post("/tasks", data);
    }

    static async completeTask(id) {
        return $api.patch(`/tasks/${id}/complete`);
    }

    static async deleteTask(id) {
        return $api.delete(`/tasks/${id}`);
    }
}

export { TaskService };
