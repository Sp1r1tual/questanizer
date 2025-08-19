import { friendsService } from "../services/friends-service.js";

const getFriends = async (req, res, next) => {
  try {
    const friends = await friendsService.getFriends(req.user.id);

    return res.json(friends);
  } catch (error) {
    next(error);
  }
};

const getFriendRequests = async (req, res, next) => {
  try {
    const result = await friendsService.getFriendRequests(req.user.id);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

const sendRequest = async (req, res, next) => {
  try {
    const { friendId } = req.body;
    const request = await friendsService.sendFriendRequest(req.user.id, friendId);

    return res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    const { requesterId } = req.body;
    const accepted = await friendsService.acceptFriendRequest(req.user.id, requesterId);

    return res.json(accepted);
  } catch (error) {
    next(error);
  }
};

const removeFriendOrCancel = async (req, res, next) => {
  try {
    const { friendId } = req.body;

    await friendsService.removeFriendOrCancelRequest(req.user.id, friendId);

    return res.json(friendId);
  } catch (error) {
    next(error);
  }
};

export { getFriends, getFriendRequests, sendRequest, acceptRequest, removeFriendOrCancel };
