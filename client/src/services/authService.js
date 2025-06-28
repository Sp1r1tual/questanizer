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

    static async requestPasswordReset(email) {
        return $api.post("/forgot-password", { email });
    }

    static async resetPassword(token, newPassword) {
        return $api.post(`/reset-password/${token}`, { password: newPassword });
    }
}

export { AuthService };
