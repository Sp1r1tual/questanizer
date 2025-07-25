const mapFriendRequests = (incoming = [], outgoing = []) => {
    const received = incoming.map((rel) => ({
        id: rel.id,
        user: rel.requester,
        status: "received",
        createdAt: rel.createdAt,
    }));

    const sent = outgoing.map((rel) => ({
        id: rel.id,
        user: rel.recipient,
        status: "sent",
        createdAt: rel.createdAt,
    }));

    return [...received, ...sent];
};

const transformFriendships = (friendships, currentUserId) => {
    return friendships.map((friendship) => {
        const isRequester =
            friendship.requester.id.toString() === currentUserId.toString();

        return {
            ...friendship,
            user: isRequester ? friendship.recipient : friendship.requester,
        };
    });
};

const findRequestId = (requests, userId) => {
    for (const [id, request] of Object.entries(requests)) {
        if (
            request.user?.id?.toString() === userId.toString() &&
            request.status === "received"
        ) {
            return id;
        }
    }
    return null;
};

const getUserIdFromFriendState = (state, type, id) => {
    if (type === "request") {
        return state.friends.requests[id]?.user?.id || null;
    }

    if (type === "friend") {
        return state.friends.friends[id]?.user?.id || null;
    }

    return null;
};

export {
    mapFriendRequests,
    transformFriendships,
    findRequestId,
    getUserIdFromFriendState,
};
