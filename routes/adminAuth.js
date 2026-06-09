import express from 'express';
import { createEvent, updateEvent, deleteEvent, getRealStats } from '../controllers/eventControllers.js';
import { authMiddleware } from '../middlewares/authmiddlewares.js'; 
import  roleMiddleware from '../middlewares/rolemiddlewares.js'; 

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.get('/stats', getRealStats);

export default router;