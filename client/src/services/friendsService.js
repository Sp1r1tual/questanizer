import { $api } from "../http";

class FriendsService {
    static async fetchUserFriends() {
        return $api.get("/friends");
    }

    static async fetchFriendRequests() {
        return $api.get("/friends/requests");
    }

    static async sendFriendRequest(friendId) {
        return $api.post("/friends/request", { friendId });
    }

    static async acceptFriendRequest(requesterId) {
        return $api.post("/friends/accept", { requesterId });
    }

    static async removeFriendOrRequest(friendId) {
        return $api.post("/friends/remove", { friendId });
    }
}

export { FriendsService };
