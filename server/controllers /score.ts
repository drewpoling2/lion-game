import { UserErrors } from '../common/errors';
import { UserModel } from '../models/score';
import { Request, Response } from 'express';

//create new high score if username doesnt exist already
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
  } catch (err) {
    res.status(500).json({ type: err });
  }
};

//gets all users on leaderboard
const getAllUsers = async (_: Request, res: Response) => {
  const users = await UserModel.find({});

  res.json({ users });
};

export { createNewHigh, getAllUsers };
