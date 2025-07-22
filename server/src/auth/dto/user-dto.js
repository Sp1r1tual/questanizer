class UserDto {
    id;
    email;
    isActivated;
    username;
    bio;
    createdAt;
    stats;

    constructor(model, stats = null) {
        this.id = model._id;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.username = model.username ?? null;
        this.bio = model.bio ?? "";
        this.createdAt = model.createdAt ?? null;
        this.stats = stats;
    }
}

export default UserDto;
