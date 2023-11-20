import { Router } from 'express';
const router = Router();
import { createNewHigh, getAllUsers } from '../controllers /score';

router.post('/new-high', createNewHigh);
router.get('/users', getAllUsers);

export { router as scoreRouter };
