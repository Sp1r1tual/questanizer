class UserDto {
  id;
  email;
  isActivated;
  username;
  bio;
  createdAt;
  stats;
  photoUrl;

  constructor(model, stats = null) {
    this.id = model._id;
    this.email = model.email;
    this.isActivated = model.isActivated;
    this.username = model.username ?? null;
    this.bio = model.bio ?? "";
    this.createdAt = model.createdAt ?? null;
    this.stats = stats;
    this.photoUrl =
      typeof model.photoUrl === "string" && model.photoUrl.trim() ? model.photoUrl : null;
  }
}

export { UserDto };
