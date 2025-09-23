import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchUserProfile } from "@/store/user/userProfileThunks";
import {
  fetchUserFriends,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendOrCancel,
} from "@/store/user/userFriendsThunks";

const useUserFriends = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.profile);
  const {
    isLoading,
    friends: friendsObj,
    requests: requestsObj,
  } = useSelector((state) => state.friends);

  useEffect(() => {
    dispatch(fetchUserFriends());
  }, [dispatch]);

  const friends = Object.values(friendsObj);
  const requests = Object.values(requestsObj).filter((r) => r.user);

  const friendStatusMap = new Map();

  for (const f of friends) {
    if (f.user?.id) {
      friendStatusMap.set(f.user.id, "friend");
    }
  }

  for (const r of requests) {
    if (r.user?.id) {
      friendStatusMap.set(r.user.id, r.status);
    }
  }

  const getFriendStatus = (userId) => friendStatusMap.get(userId) || "none";

  const handleAddFriend = async (friendId) => {
    await dispatch(sendFriendRequest(friendId)).unwrap();

    dispatch(fetchUserFriends());
  };

  const handleAcceptRequest = async (userId) => {
    if (!currentUser) {
      await dispatch(fetchUserProfile()).unwrap();
    }

    await dispatch(acceptFriendRequest(userId)).unwrap();

    await dispatch(fetchUserFriends());
  };

  const handleRemoveFriendOrCancel = async (id, type = "friend") => {
    await dispatch(removeFriendOrCancel({ id, type })).unwrap();

    dispatch(fetchUserFriends());
  };

  return {
    isLoading,
    currentUser,
    friends,
    requests,
    getFriendStatus,
    handleAddFriend,
    handleAcceptRequest,
    handleRemoveFriendOrCancel,
  };
};

export { useUserFriends };
