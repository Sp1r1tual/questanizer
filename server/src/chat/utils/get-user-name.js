import { UserModel } from "../../user/models/user-model.js";

const getUserName = async (userId) => {
  const user = await UserModel.findById(userId).select("username");

  return user?.username || null;
};

export { getUserName };
