import { createSlice } from "@reduxjs/toolkit";
import {
    fetchUserFriends,
    sendFriendRequest,
    acceptFriendRequest,
    removeFriendOrCancel,
} from "./userFriendsThunks";
import {
    removeRequestById,
    removeIncomingRequestByUserId,
} from "../../utils/store/user/friendRequest";

const initialState = {
    friends: {},
    requests: {},
    isLoading: false,
    error: null,
};

const userFriendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {
        clearFriendsState(state) {
            state.friends = {};
            state.requests = {};
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserFriends.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserFriends.fulfilled, (state, action) => {
                state.isLoading = false;
                state.friends = {};
                state.requests = {};
                action.payload.friends.forEach((friendship) => {
                    state.friends[friendship.id] = {
                        id: friendship.id,
                        user: friendship.user,
                        status: friendship.status,
                        createdAt: friendship.createdAt,
                    };
                });
                action.payload.requests.forEach((req) => {
                    state.requests[req.id] = req;
                });
            })
            .addCase(fetchUserFriends.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(sendFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(acceptFriendRequest.fulfilled, (state, action) => {
                const { requestId, friendship } = action.payload;

                if (requestId) {
                    removeRequestById(state.requests, requestId);
                    return;
                }

                const targetUserId = friendship.user?.id?.toString();

                removeIncomingRequestByUserId(state.requests, targetUserId);

                state.friends[friendship.id] = {
                    id: friendship.id,
                    user: friendship.user,
                    status: friendship.status,
                    createdAt: friendship.createdAt,
                };
            })
            .addCase(acceptFriendRequest.rejected, (state, action) => {
                state.error = action.payload;
                console.error("Accept friend request failed:", action.payload);
            })

            .addCase(removeFriendOrCancel.fulfilled, (state, action) => {
                const { id, type } = action.payload;

                if (type === "request") {
                    const { [id]: _, ...newRequests } = state.requests;
                    state.requests = newRequests;
                    return;
                }

                if (type === "friend") {
                    const { [id]: _, ...newFriends } = state.friends;
                    state.friends = newFriends;
                }
            })
            .addCase(removeFriendOrCancel.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearFriendsState } = userFriendsSlice.actions;

export default userFriendsSlice.reducer;
