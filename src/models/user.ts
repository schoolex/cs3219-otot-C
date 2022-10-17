import mongoose from 'mongoose';

export interface User {
  _id?: string;
  username: string;
  password: string;
  role: string;
}

export interface UserUpdateOptions {
  password?: string;
}

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
  role: String,
});

export const UserModel = mongoose.model<User>('user', userSchema);
