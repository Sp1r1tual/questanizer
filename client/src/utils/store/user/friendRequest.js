const removeRequestById = (requests, id) => {
  if (!(id in requests)) return requests;

  const rest = { ...requests };
  delete rest[id];

  return rest;
};

const removeIncomingRequestByUserId = (requests, targetUserId) => {
  for (const [id, request] of Object.entries(requests)) {
    const requestUserId = request.user?.id?.toString();
    const isReceived = request.status === "received";

    if (requestUserId === targetUserId && isReceived) {
      const rest = { ...requests };
      delete rest[id];
      return rest;
    }
  }
  return requests;
};

export { removeRequestById, removeIncomingRequestByUserId };
