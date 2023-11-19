import { UserErrors } from '../common/errors';
import { UserModel } from '../models/score';
import { Request, Response } from 'express';

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

export { createNewHigh };
