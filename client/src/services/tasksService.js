import { $api } from "@/http";

class TaskService {
  static getAllTasks() {
    return $api.get("/tasks");
  }

  static createTask(data) {
    return $api.post("/tasks", data);
  }

  static deleteTask(id) {
    return $api.delete(`/tasks/${id}`);
  }

  static completeTask(id) {
    return $api.patch(`/tasks/${id}/complete`);
  }

  static takeDamageOverdueTask(id) {
    return $api.patch(`/tasks/${id}/overdue`);
  }
}

export { TaskService };
