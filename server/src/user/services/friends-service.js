import { FriendsModel } from "../models/friends-model.js";
import { findUserById } from "../../shared/helpers/findUserById.js";
import { FriendDto } from "../../shared/dtos/friend-dto.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

class FriendsService {
    async getFriends(userId) {
        try {
            const accepted = await FriendsModel.find({
                $or: [{ requester: userId }, { recipient: userId }],
                status: "accepted",
            })
                .populate("requester")
                .populate("recipient")
                .lean();

            return accepted.map((rel) => new FriendDto(rel));
        } catch (error) {
            console.error("Error in getFriends:", error);
            throw error;
        }
    }

    async getFriendRequests(userId) {
        try {
            const incoming = await FriendsModel.find({
                recipient: userId,
                status: "pending",
            })
                .populate("requester")
                .populate("recipient")
                .lean();

            const outgoing = await FriendsModel.find({
                requester: userId,
                status: "pending",
            })
                .populate("requester")
                .populate("recipient")
                .lean();

            return {
                incoming: incoming.map((rel) => new FriendDto(rel)),
                outgoing: outgoing.map((rel) => new FriendDto(rel)),
            };
        } catch (error) {
            console.error("Error in getFriendRequests:", error);
            throw error;
        }
    }

    async sendFriendRequest(requesterId, recipientId) {
        try {
            if (requesterId === recipientId) {
                throw ApiError.BadRequest("Cannot send request to yourself");
            }

            await findUserById(recipientId);

            const existing = await FriendsModel.findOne({
                $or: [
                    { requester: requesterId, recipient: recipientId },
                    { requester: recipientId, recipient: requesterId },
                ],
            });

            if (existing) {
                if (existing.status === "accepted") {
                    throw new ApiError(409, "Already friends");
                }

                throw new ApiError(409, "Friend request already exists");
            }

            const request = await FriendsModel.create({
                requester: requesterId,
                recipient: recipientId,
                status: "pending",
            });

            try {
                await request.populate(["requester", "recipient"]);
                return new FriendDto(request);
            } catch (err) {
                await FriendsModel.deleteOne({ _id: request._id });
                throw err;
            }
        } catch (error) {
            console.error("Error in sendFriendRequest:", error);
            throw error;
        }
    }

    async acceptFriendRequest(recipientId, requesterId) {
        try {
            const request = await FriendsModel.findOneAndUpdate(
                {
                    requester: requesterId,
                    recipient: recipientId,
                    status: "pending",
                },
                { status: "accepted" },
                { new: true }
            )
                .populate("requester")
                .populate("recipient");

            if (!request) {
                throw ApiError.BadRequest("Friend request not found");
            }

            return new FriendDto(request);
        } catch (error) {
            console.error("Error in acceptFriendRequest:", error);
            throw error;
        }
    }

    async removeFriendOrCancelRequest(userId, otherUserId) {
        try {
            const deleted = await FriendsModel.findOneAndDelete({
                $or: [
                    { requester: userId, recipient: otherUserId },
                    { requester: otherUserId, recipient: userId },
                ],
            });

            if (!deleted) {
                throw ApiError.BadRequest("Friendship or request not found");
            }

            return;
        } catch (error) {
            console.error("Error in removeFriendOrCancelRequest:", error);
            throw error;
        }
    }
}

const friendsService = new FriendsService();

export { friendsService };
