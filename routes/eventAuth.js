import express from 'express';
import { getActiveEvents, getArchiveEvents, getSingleEvent, getLatestEvents, getRealStats , getGoals} from '../controllers/eventControllers.js';
import { 
    registerToEvent, 
    cancelRegistration, 
    checkRegistrationStatus } from '../controllers/registrationController.js';
import { authMiddleware } from '../middlewares/authmiddlewares.js';

const router = express.Router();

router.get('/active',authMiddleware,getActiveEvents);
router.get('/archive',authMiddleware,getArchiveEvents);
router.get('/latest',authMiddleware,getLatestEvents);
router.get('/:id',authMiddleware,getSingleEvent);
router.post('/register',  authMiddleware,registerToEvent);
router.post('/cancel', authMiddleware,cancelRegistration);
router.get('/status/:event_id',authMiddleware,checkRegistrationStatus);

export default router;