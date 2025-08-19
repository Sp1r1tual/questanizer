import { $api } from "@/http";

class FriendsService {
  static fetchUserFriends() {
    return $api.get("/friends");
  }

  static fetchFriendRequests() {
    return $api.get("/friends/requests");
  }

  static sendFriendRequest(friendId) {
    return $api.post("/friends/request", { friendId });
  }

  static acceptFriendRequest(requesterId) {
    return $api.post("/friends/accept", { requesterId });
  }

  static removeFriendOrRequest(friendId) {
    return $api.post("/friends/remove", { friendId });
  }
}

export { FriendsService };
