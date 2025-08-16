const normalizeUserProfile = (data) => ({
    username: data.username || null,
    name: data.username || "No name",
    level: data.stats?.level ?? null,
    health: data.stats?.hp ?? null,
    registrationDate: data.stats?.createdAt || null,
    bio: data.bio || "",
    photoUrl: data.photoUrl || null,
});

export { normalizeUserProfile };
