import { UserErrors, ServerErrors } from '../common/errors';
import { UserModel } from '../models/score';
import { Request, Response } from 'express';

//create new high score if username doesn't exist already
const createNewHigh = async (req: Request, res: Response) => {
  const { username, score } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
    }
    const newScore = new UserModel({ username, score });
    await newScore.save();
    res.json({ message: 'New high score saved successfully' });
  } catch (error) {
    res.status(500).json({ type: ServerErrors.SERVER_ERROR, error });
  }
};

//deletes one entry from collection by username
const deleteEntryByUsername = async (req: Request, res: Response) => {
  try {
    const entryUsername = req.params.username;
    const deletedEntry = await UserModel.findOneAndDelete({
      username: entryUsername,
    });
    if (!deletedEntry) {
      return res.status(404).json({ type: UserErrors.NO_USER_FOUND });
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ type: ServerErrors.SERVER_ERROR, error });
  }
};

//gets all users on leaderboard
const getAllUsers = async (_: Request, res: Response) => {
  const users = await UserModel.find({});
  res.json({ users });
};

export { createNewHigh, getAllUsers, deleteEntryByUsername };
