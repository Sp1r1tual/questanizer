class UserDto {
    id;
    email;
    isActivated;
    username;
    bio;

    constructor(model) {
        this.id = model._id; // Mongo DB _id
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.username = model.username ?? null;
        this.bio = model.bio ?? "";
    }
}

export default UserDto;
