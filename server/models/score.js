import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  score: { type: String, required: true },
});

export const UserModel = model('user', UserSchema);
