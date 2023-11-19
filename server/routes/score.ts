import express from 'express';
const router = express.Router();
import { createNewHigh } from '../controllers /score';

router.post('/new-high', createNewHigh);

export { router as scoreRouter };
