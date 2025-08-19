import { UserDto } from "./user-dto.js";

class FriendDto {
  id;
  requester;
  recipient;
  status;
  createdAt;

  constructor(model) {
    this.id = model._id;
    this.status = model.status;
    this.createdAt = model.createdAt;
    this.requester = new UserDto(model.requester);
    this.recipient = new UserDto(model.recipient);
  }
}

export { FriendDto };
