import { User, UserModel, UserUpdateOptions } from '../models/user';

const createUser = async (user: User) => {
  const newUser = await UserModel.create(user);
  return newUser;
};

const getUser = async (username: string) => {
  const user = await UserModel.findOne({ username }).select('-__v').lean();
  return user;
};

const deleteUser = async (username: string) => {
  const deletedUser = await UserModel.deleteOne({ username }).select('-__v').lean();
  return deletedUser;
};

const UserRepo = {
  createUser,
  getUser,
  deleteUser,
};

export { UserRepo as default };
