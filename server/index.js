import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { scoreRouter } from './routes/score.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/scores', scoreRouter);
mongoose.connect(
  'mongodb+srv://drewpoling2:5Uu4NNRWb4zf6HmM@cluster0.lmegfru.mongodb.net/?retryWrites=true&w=majority'
);

app.listen(3001, () => console.log('Server is now listening on port 3001'));

app.get('/', (req, res) => res.json('lion-game api is running'));
