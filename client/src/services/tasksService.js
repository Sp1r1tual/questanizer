import { $api } from "@/http";

class TaskService {
    static async getAllTasks() {
        return $api.get("/tasks");
    }

    static async createTask(data) {
        return $api.post("/tasks", data);
    }

    static async deleteTask(id) {
        return $api.delete(`/tasks/${id}`);
    }

    static async completeTask(id) {
        return $api.patch(`/tasks/${id}/complete`);
    }

    static async takeDamageOverdueTask(id) {
        return $api.patch(`/tasks/${id}/overdue`);
    }
}

export { TaskService };
