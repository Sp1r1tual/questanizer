import { createAsyncThunk } from "@reduxjs/toolkit";
import { FriendsService } from "../../services/friendsService";
import { getCurrentUserId } from "../../utils/store/user/getCurrentUserId";
import {
    mapFriendRequests,
    transformFriendships,
    findRequestId,
    getUserIdFromFriendState,
} from "../../utils/store/user/friendTransformers";

const fetchUserFriends = createAsyncThunk(
    "friends/fetchUserFriends",
    async (_, thunkAPI) => {
        try {
            const friendsRes = await FriendsService.fetchUserFriends();
            const requestsRes = await FriendsService.fetchFriendRequests();

            const currentUserId = await getCurrentUserId(thunkAPI);
            const friends = transformFriendships(
                friendsRes.data || [],
                currentUserId
            );
            const requests = mapFriendRequests(
                requestsRes.data.incoming,
                requestsRes.data.outgoing
            );

            return { friends, requests };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.message ||
                    error.response?.data?.message ||
                    "Failed to fetch friends"
            );
        }
    }
);

const sendFriendRequest = createAsyncThunk(
    "friends/sendRequest",
    async (friendId, thunkAPI) => {
        try {
            const response = await FriendsService.sendFriendRequest(friendId);

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to send request"
            );
        }
    }
);

const acceptFriendRequest = createAsyncThunk(
    "friends/acceptRequest",
    async (requesterId, thunkAPI) => {
        try {
            const response = await FriendsService.acceptFriendRequest(
                requesterId
            );
            const currentUserId = await getCurrentUserId(thunkAPI);

            const requests = thunkAPI.getState().friends.requests;
            const requestId = findRequestId(requests, requesterId);

            const isRequester =
                response.data.requester.id.toString() ===
                currentUserId.toString();

            const friendship = {
                ...response.data,
                user: isRequester
                    ? response.data.recipient
                    : response.data.requester,
            };

            return { requestId, friendship };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || "Failed to accept request"
            );
        }
    }
);

const removeFriendOrCancel = createAsyncThunk(
    "friends/removeOrCancel",
    async ({ id, type }, thunkAPI) => {
        try {
            const state = thunkAPI.getState();

            const friendId = getUserIdFromFriendState(state, type, id);

            if (!friendId) {
                throw new Error("User ID not found");
            }

            await FriendsService.removeFriendOrRequest(friendId);

            return { id, type };
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Failed to remove friend"
            );
        }
    }
);

export {
    fetchUserFriends,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriendOrCancel,
};
