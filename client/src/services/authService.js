import { $api } from "@/http";

class AuthService {
  static login(email, password) {
    return $api.post("/login", { email, password });
  }

  static registration(email, password) {
    return $api.post("/registration", { email, password });
  }

  static logout() {
    return $api.post("/logout");
  }

  static requestPasswordReset(email) {
    return $api.post("/forgot-password", { email });
  }

  static resetPassword(token, newPassword) {
    return $api.post(`/reset-password/${token}`, { password: newPassword });
  }
}

export { AuthService };
