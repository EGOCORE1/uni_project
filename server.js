import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userAuth.js';
import eventRoutes from './routes/eventAuth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send('Server is running ✅');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});