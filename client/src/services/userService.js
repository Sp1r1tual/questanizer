import { $api } from "@/http";

class UserService {
    static async fetchUsers() {
        return $api.get("/users");
    }

    static async getUserPublicProfile(id) {
        return $api.get(`/user/${id}`);
    }

    static async searchUsers(query) {
        return $api.get("/users/search", { params: { query } });
    }

    static async fetchUserProfile() {
        return $api.get("/profile");
    }

    static async updateUserProfile(data) {
        return $api.patch("/profile", data);
    }
}

export { UserService };
