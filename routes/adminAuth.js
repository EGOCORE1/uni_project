import express from 'express';
import { createEvent, updateEvent, deleteEvent, getRealStats } from '../controllers/eventControllers.js';
import { authMiddleware } from '../middlewares/authmiddlewares.js'; 
import  roleMiddleware from '../middlewares/rolemiddlewares.js'; 
import { upload } from '../controllers/eventMediaController.js';

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.post('/events', roleMiddleware('admin'),upload.array('images',2),createEvent);
router.put('/events/:id', roleMiddleware('admin'),upload.array('images',2),updateEvent);
router.delete('/events/:id', roleMiddleware('admin'),deleteEvent);

export default router;