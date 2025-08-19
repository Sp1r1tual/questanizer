import { $api } from "@/http";

class BossService {
  static getBoss() {
    return $api.get("/boss");
  }

  static spawnBoss() {
    return $api.post("/boss/spawn");
  }
}

export { BossService };
