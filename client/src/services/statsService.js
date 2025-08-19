import { $api } from "@/http";

class StatsService {
  static getStats() {
    return $api.get("/stats");
  }

  static resetStats() {
    return $api.patch("/stats/reset");
  }
}

export { StatsService };
