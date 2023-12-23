import { UserModel } from '../models/score.js';

//create new high score if username doesn't exist already
const createNewHigh = async (req, res) => {
  const { username, score } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      return res.status(400).json({ type: 'username already existsss' });
    }
    const newScore = new UserModel({ username, score });
    await newScore.save();
    res.json({ message: 'New high score saved successfully' });
  } catch (error) {
    res.status(500).json({ type: 'server error', error });
  }
};

//deletes one entry from collection by username
const deleteEntryByUsername = async (req, res) => {
  try {
    const entryUsername = req.params.username;
    const deletedEntry = await UserModel.findOneAndDelete({
      username: entryUsername,
    });
    if (!deletedEntry) {
      return res.status(404).json({ type: 'no user found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ type: 'server error', error });
  }
};

//gets all users on leaderboard
const getAllUsers = async (_, res) => {
  const users = await UserModel.find({});
  res.json({ users });
};

export { createNewHigh, getAllUsers, deleteEntryByUsername };
