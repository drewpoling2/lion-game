import { Router } from 'express';
const router = Router();
import {
  createNewHigh,
  getAllUsers,
  deleteEntryByUsername,
} from '../controllers /score';

router.delete('/delete-entry/:username', deleteEntryByUsername);
router.post('/new-high', createNewHigh);
router.get('/users', getAllUsers);

export { router as scoreRouter };
