import { $api } from "../http";

class AuthService {
    static async login(email, password) {
        return $api.post("/login", { email, password });
    }

    static async registration(email, password) {
        return $api.post("/registration", { email, password });
    }

    static async logout() {
        return $api.post("/logout");
    }
}

export { AuthService };
