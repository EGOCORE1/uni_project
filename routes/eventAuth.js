import express from 'express';
import { 
    createEvent, 
    getAllEvents, 
    getSingleEvent, 
    updateEvent, 
    deleteEvent 
} from '../controllers/eventControllers.js';

import authMiddleware from '../middlewares/authmiddlewares.js';
import roleMiddleware from '../middlewares/rolemiddlewares.js';
import { registerToEvent
 } from '../controllers/registrationController.js';
const router = express.Router();

router.post('/create', authMiddleware, roleMiddleware('admin'), createEvent);
router.get('/all', authMiddleware, getAllEvents);
router.get('/:id', authMiddleware, getSingleEvent);

router.put('/update/:id', authMiddleware, roleMiddleware('admin'), updateEvent);
router.delete('/del/:id', authMiddleware, roleMiddleware('admin'), deleteEvent);
router.post('/register',registerToEvent)
export default router;