import express from 'express';
import { 
    createEvent, 
    getAllEvents, 
    getSingleEvent, 
    getLatestEvents,
    updateEvent, 
    deleteEvent ,
    getRealStats
} from '../controllers/eventControllers.js';

import authMiddleware from '../middlewares/authmiddlewares.js';
import roleMiddleware from '../middlewares/rolemiddlewares.js';
import { registerToEvent
 } from '../controllers/registrationController.js';
const router = express.Router();

router.get('/stats/real', getRealStats)
router.get('/lastest', getLatestEvents)
router.get('/all', getAllEvents)
router.get('/:id', getSingleEvent)
router.post('/register',registerToEvent)
router.post('/create', authMiddleware, roleMiddleware('admin'), createEvent);
router.put('/update/:id', authMiddleware, roleMiddleware('admin'), updateEvent);
router.delete('/del/:id', authMiddleware, roleMiddleware('admin'), deleteEvent);

export default router;