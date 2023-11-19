import { Schema, model } from 'mongoose';

export interface IUser {
  _id?: string;
  username: string;
  score: string;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  score: { type: String, required: true },
});

export const UserModel = model<IUser>('user', UserSchema);
