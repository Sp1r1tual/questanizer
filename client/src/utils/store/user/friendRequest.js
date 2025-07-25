const removeRequestById = (requests, id) => {
    if (id in requests) {
        delete requests[id];
    }
};

const removeMatchingReceivedRequest = (requests, targetUserId) => {
    for (const [id, request] of Object.entries(requests)) {
        const requestUserId = request.user?.id?.toString();
        const isReceived = request.status === "received";

        if (requestUserId === targetUserId && isReceived) {
            delete requests[id];
            break;
        }
    }
};

export { removeRequestById, removeMatchingReceivedRequest };
