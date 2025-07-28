import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    fetchUserFriends,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriendOrCancel,
} from "../../store/user/userFriendsThunks";
import { fetchUserProfile } from "../../store/user/userProfileThunks";

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

    useEffect(() => {
        if (!currentUser) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, currentUser]);

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
        try {
            await dispatch(sendFriendRequest(friendId)).unwrap();

            dispatch(fetchUserFriends());
        } catch (error) {
            console.error("Failed to send friend request", error);
        }
    };

    const handleAcceptRequest = async (userId) => {
        try {
            if (!currentUser) {
                await dispatch(fetchUserProfile()).unwrap();
            }

            await dispatch(acceptFriendRequest(userId)).unwrap();
        } catch (error) {
            console.error("Failed to accept friend request", error);
        }
    };

    const handleRemoveFriendOrCancel = async (id, type = "friend") => {
        try {
            await dispatch(removeFriendOrCancel({ id, type })).unwrap();

            dispatch(fetchUserFriends());
        } catch (error) {
            console.error("Failed to remove friend/request", error);
        }
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
