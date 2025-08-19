import { $api } from "@/http";

class UserService {
  static fetchUsers() {
    return $api.get("/users");
  }

  static getUserPublicProfile(id) {
    return $api.get(`/user/${id}`);
  }

  static searchUsers(query) {
    return $api.get("/users/search", { params: { query } });
  }

  static fetchUserProfile() {
    return $api.get("/profile");
  }

  static updateUserProfile(data) {
    return $api.patch("/profile", data);
  }
}

export { UserService };
