import { jest } from "@jest/globals";

const mockFriendsModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    deleteOne: jest.fn(),
};

const mockFindUserById = jest.fn();

const mockFriendDto = jest.fn();

jest.unstable_mockModule("../../user/models/friends-model.js", () => ({
    default: mockFriendsModel,
}));

jest.unstable_mockModule("../../shared/helpers/findUserById.js", () => ({
    findUserById: mockFindUserById,
}));

jest.unstable_mockModule("../../shared/dtos/friend-dto.js", () => ({
    default: mockFriendDto,
}));

jest.unstable_mockModule("../../shared/exceptions/api-error.js", () => {
    class ApiError extends Error {
        constructor(status, message) {
            super(message);
            this.status = status;
        }
        static BadRequest(msg) {
            return new ApiError(400, msg);
        }
    }
    return { default: ApiError };
});

let FriendsService;

beforeAll(async () => {
    const module = await import("../../user/services/friends-service.js");
    FriendsService = module.default;
});

beforeEach(() => {
    jest.clearAllMocks();
});

describe("FriendsService", () => {
    describe("getFriends", () => {
        it("returns FriendDto array for accepted friends", async () => {
            const mockData = [{ _id: "1" }, { _id: "2" }];

            mockFriendsModel.find.mockReturnValue({
                populate: jest.fn().mockReturnThis(),
                lean: jest.fn().mockResolvedValue(mockData),
            });
            mockFriendDto.mockImplementation((rel) => ({ id: rel._id }));

            const result = await FriendsService.getFriends("user123");

            expect(mockFriendsModel.find).toHaveBeenCalledWith({
                $or: [{ requester: "user123" }, { recipient: "user123" }],
                status: "accepted",
            });
            expect(result).toEqual([{ id: "1" }, { id: "2" }]);
        });
    });

    describe("getFriendRequests", () => {
        it("returns incoming and outgoing requests mapped with FriendDto", async () => {
            const incomingData = [{ _id: "in1" }];
            const outgoingData = [{ _id: "out1" }];

            mockFriendsModel.find
                .mockReturnValueOnce({
                    populate: jest.fn().mockReturnThis(),
                    lean: jest.fn().mockResolvedValue(incomingData),
                })
                .mockReturnValueOnce({
                    populate: jest.fn().mockReturnThis(),
                    lean: jest.fn().mockResolvedValue(outgoingData),
                });

            mockFriendDto.mockImplementation((rel) => ({ id: rel._id }));

            const result = await FriendsService.getFriendRequests("user123");

            expect(mockFriendsModel.find).toHaveBeenNthCalledWith(1, {
                recipient: "user123",
                status: "pending",
            });
            expect(mockFriendsModel.find).toHaveBeenNthCalledWith(2, {
                requester: "user123",
                status: "pending",
            });
            expect(result).toEqual({
                incoming: [{ id: "in1" }],
                outgoing: [{ id: "out1" }],
            });
        });
    });

    describe("sendFriendRequest", () => {
        it("throws if requester equals recipient", async () => {
            await expect(
                FriendsService.sendFriendRequest("user123", "user123")
            ).rejects.toThrow("Cannot send request to yourself");
        });

        it("throws if recipient not found", async () => {
            mockFindUserById.mockRejectedValue(new Error("Not found"));

            await expect(
                FriendsService.sendFriendRequest("user123", "user456")
            ).rejects.toThrow("Not found");
        });

        it("throws if existing accepted friend relation", async () => {
            mockFindUserById.mockResolvedValue(true);
            mockFriendsModel.findOne.mockResolvedValue({ status: "accepted" });

            await expect(
                FriendsService.sendFriendRequest("user123", "user456")
            ).rejects.toThrow("Already friends");
        });

        it("throws if friend request already exists", async () => {
            mockFindUserById.mockResolvedValue(true);
            mockFriendsModel.findOne.mockResolvedValue({ status: "pending" });

            await expect(
                FriendsService.sendFriendRequest("user123", "user456")
            ).rejects.toThrow("Friend request already exists");
        });

        it("creates friend request and returns FriendDto", async () => {
            mockFindUserById.mockResolvedValue(true);
            mockFriendsModel.findOne.mockResolvedValue(null);

            const fakeRequest = {
                _id: "req1",
                populate: jest.fn().mockResolvedValue({
                    _id: "req1",
                    requester: "user123",
                    recipient: "user456",
                    status: "pending",
                }),
            };

            mockFriendsModel.create.mockResolvedValue(fakeRequest);
            mockFriendDto.mockImplementation((rel) => ({ id: rel._id }));

            const result = await FriendsService.sendFriendRequest(
                "user123",
                "user456"
            );

            expect(mockFriendsModel.create).toHaveBeenCalledWith({
                requester: "user123",
                recipient: "user456",
                status: "pending",
            });
            expect(result).toEqual({ id: "req1" });
        });

        it("deletes request if populate fails", async () => {
            mockFindUserById.mockResolvedValue(true);
            mockFriendsModel.findOne.mockResolvedValue(null);

            const fakeRequest = {
                _id: "req1",
                populate: jest
                    .fn()
                    .mockRejectedValue(new Error("Populate fail")),
            };

            mockFriendsModel.create.mockResolvedValue(fakeRequest);
            mockFriendsModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

            await expect(
                FriendsService.sendFriendRequest("user123", "user456")
            ).rejects.toThrow("Populate fail");

            expect(mockFriendsModel.deleteOne).toHaveBeenCalledWith({
                _id: "req1",
            });
        });
    });

    describe("acceptFriendRequest", () => {
        it("throws if no pending request found", async () => {
            mockFriendsModel.findOneAndUpdate.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(null),
                }),
            });

            await expect(
                FriendsService.acceptFriendRequest("user123", "user456")
            ).rejects.toThrow("Friend request not found");
        });

        it("returns accepted FriendDto", async () => {
            const fakeRequest = {
                _id: "req1",
                requester: "user456",
                recipient: "user123",
                status: "accepted",
            };

            mockFriendsModel.findOneAndUpdate.mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockResolvedValue(fakeRequest),
                }),
            });

            mockFriendDto.mockImplementation((rel) => ({ id: rel._id }));

            const result = await FriendsService.acceptFriendRequest(
                "user123",
                "user456"
            );

            expect(mockFriendsModel.findOneAndUpdate).toHaveBeenCalledWith(
                {
                    requester: "user456",
                    recipient: "user123",
                    status: "pending",
                },
                { status: "accepted" },
                { new: true }
            );
            expect(result).toEqual({ id: "req1" });
        });
    });

    describe("removeFriendOrCancelRequest", () => {
        it("throws if friendship or request not found", async () => {
            mockFriendsModel.findOneAndDelete.mockResolvedValue(null);

            await expect(
                FriendsService.removeFriendOrCancelRequest("user123", "user456")
            ).rejects.toThrow("Friendship or request not found");
        });

        it("resolves if deleted successfully", async () => {
            mockFriendsModel.findOneAndDelete.mockResolvedValue({
                _id: "del1",
            });

            await expect(
                FriendsService.removeFriendOrCancelRequest("user123", "user456")
            ).resolves.toBeUndefined();

            expect(mockFriendsModel.findOneAndDelete).toHaveBeenCalledWith({
                $or: [
                    { requester: "user123", recipient: "user456" },
                    { requester: "user456", recipient: "user123" },
                ],
            });
        });
    });
});
