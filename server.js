import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userAuth.js';
import homeRoutes from './routes/home.js'
import eventRoutes from './routes/eventAuth.js';
import adminRoutes from './routes/adminAuth.js';
import { authMiddleware } from './middlewares/authmiddlewares.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/home', homeRoutes);

app.use('/api/admin', authMiddleware, adminRoutes);
app.get('/', (req, res) => {
    res.send('Server is running perfectly! 🚀');
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});