import { userService } from "../services/user-service.js";

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId, true);

    return res.json({
      id: user.id,
      email: user.email,
      username: user.username ?? null,
      bio: user.bio ?? "",
      isActivated: user.isActivated,
      createdAt: user.createdAt,
      stats: user.stats ?? null,
      photoUrl: user.photoUrl ?? null,
    });
  } catch (error) {
    return next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { username, bio } = req.body;
    const update = {};

    if (username !== undefined) update.username = username;
    if (bio !== undefined) update.bio = bio;

    if (req.file && req.file.path) {
      update.photoUrl = req.file.path;
    }

    const updatedUser = await userService.updateUserProfile(userId, update);

    return res.json(updatedUser);
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const getUserByIdPublic = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId, true);

    return res.json({
      id: user.id,
      username: user.username ?? null,
      bio: user.bio ?? "",
      createdAt: user.createdAt,
      stats: user.stats ?? null,
      photoUrl: user.photoUrl ?? null,
    });
  } catch (error) {
    return next(error);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const requesterId = req.user.id;
    const { query, page, limit } = req.query;

    const result = await userService.searchUsers(query.trim(), requesterId, page, limit);

    return res.json(result);
  } catch (error) {
    next(error);
  }
};

export { getUserProfile, updateUserProfile, getUsers, getUserByIdPublic, searchUsers };
