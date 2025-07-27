import { FriendsModel } from "../models/friends-model.js";
import { findUserById } from "../../shared/helpers/findUserById.js";
import { FriendDto } from "../../shared/dtos/friend-dto.js";
import { ApiError } from "../../shared/exceptions/api-error.js";

class FriendsService {
    async getFriends(userId) {
        const accepted = await FriendsModel.find({
            $or: [{ requester: userId }, { recipient: userId }],
            status: "accepted",
        })
            .populate("requester")
            .populate("recipient")
            .lean();

        return accepted.map((rel) => new FriendDto(rel));
    }

    async getFriendRequests(userId) {
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
    }

    async sendFriendRequest(requesterId, recipientId) {
        if (requesterId === recipientId) {
            throw ApiError.Conflict("Cannot send request to yourself");
        }

        await findUserById(recipientId);

        const existing = await FriendsModel.findOne({
            $or: [
                { requester: requesterId, recipient: recipientId },
                { requester: recipientId, recipient: requesterId },
            ],
        });

        if (existing?.status === "accepted") {
            throw ApiError.Conflict("Already friends");
        }

        if (existing) {
            throw ApiError.Conflict("Friend request already exists");
        }

        const request = await FriendsModel.create({
            requester: requesterId,
            recipient: recipientId,
            status: "pending",
        });

        try {
            await request.populate(["requester", "recipient"]);

            return new FriendDto(request);
        } catch (error) {
            await FriendsModel.deleteOne({ _id: request._id });
            throw error;
        }
    }

    async acceptFriendRequest(recipientId, requesterId) {
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
            throw ApiError.NotFound("Friend request not found");
        }

        return new FriendDto(request);
    }

    async removeFriendOrCancelRequest(userId, otherUserId) {
        const deleted = await FriendsModel.findOneAndDelete({
            $or: [
                { requester: userId, recipient: otherUserId },
                { requester: otherUserId, recipient: userId },
            ],
        });

        if (!deleted) {
            throw ApiError.NotFound("Friendship or request not found");
        }

        return;
    }
}

const friendsService = new FriendsService();

export { friendsService };
