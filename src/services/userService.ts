import { logger } from '../loggers/logger';
import { UserUpdateOptions } from '../models/user';
import UserRepo from '../repository/userRepo';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Exception } from '../exceptions';

const ROUNDS = 10;

const generateJWT = (username: string, role: string) => {
  const token = jwt.sign({ username, role }, process.env.JWT_SECRET, {
    expiresIn: '6h',
  });
  return token;
};

const register = async (username: string, password: string, role: string) => {
  logger.info(`Creating user with username: ${username}`);
  let hashedPassword = await bcrypt.hash(password, ROUNDS);
  try {
    const newUser = await UserRepo.createUser({
      username,
      password: hashedPassword,
      role,
    });
    if (!newUser) {
      throw new Exception(`Failed to create user with username: ${username}`, 400);
    }
    return {
      token: generateJWT(username, role),
      id: newUser._id,
      username: newUser.username,
    };
  }
  catch (err) {
    throw new Exception(`username: ${username} is already taken`, 400);
  }
};

const login = async (username: string, password: string) => {
  logger.info(`Logging in username: ${username}`);
  const user = await UserRepo.getUser(username);
  if (!user) {
    throw new Exception(`Failed to get user with id: ${username}`, 404);
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new Exception(`Incorrect password for username: ${username}`, 401);
  }
  return {
    token: generateJWT(username, user.role),
    id: user._id,
    username: user.username,
  };
};

const getUser = async (username: string) => {
  logger.info(`Deleting ${username}'s account`);
  const user = await UserRepo.getUser(username);
  if (!user) {
    throw new Exception(`Cannot find ${username}'s account`, 404);
  }
  return user;
};

const UserService = {
  register,
  login,
  getUser,
};

export { UserService as default };
