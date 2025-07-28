const removeRequestById = (requests, id) => {
    if (!(id in requests)) return requests;
    const { [id]: _, ...rest } = requests;
    return rest;
};

const removeIncomingRequestByUserId = (requests, targetUserId) => {
    for (const [id, request] of Object.entries(requests)) {
        const requestUserId = request.user?.id?.toString();
        const isReceived = request.status === "received";

        if (requestUserId === targetUserId && isReceived) {
            const { [id]: _, ...rest } = requests;
            return rest;
        }
    }
    return requests;
};

export { removeRequestById, removeIncomingRequestByUserId };
