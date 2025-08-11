import { $api } from "@/http";

class StatsService {
    static async getStats() {
        return $api.get("/stats");
    }

    static async resetStats() {
        return $api.patch("/stats/reset");
    }
}

export { StatsService };
