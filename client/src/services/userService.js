import { $api } from "../http";

class UserService {
    static async fetchUsers() {
        return $api.post("/users");
    }
}

export { UserService };
