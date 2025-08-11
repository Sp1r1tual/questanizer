import { $api } from "@/http";

class BossService {
    static async getBoss() {
        return $api.get("/boss");
    }

    static async spawnBoss() {
        return $api.post("/boss/spawn");
    }
}

export { BossService };
