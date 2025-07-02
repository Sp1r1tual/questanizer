import { $api } from "../http";

class StatsService {
    static async getStats() {
        return $api.get("/stats");
    }

    static async gainExperience(amount) {
        return $api.patch("/stats/gain-experience", amount);
    }

    static async takeDamage(amount) {
        return $api.patch("/stats/take-damage", amount);
    }

    static async resetStats() {
        return $api.patch("/stats/reset");
    }
}

export { StatsService };
