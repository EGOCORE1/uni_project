import express from 'express';
import { getActiveEvents, getArchiveEvents, getSingleEvent, getLatestEvents} from '../controllers/eventControllers.js';
import { 
    registerToEvent, 
    cancelRegistration, 
    checkRegistrationStatus } from '../controllers/registrationController.js';
import { authMiddleware } from '../middlewares/authmiddlewares.js';

const router = express.Router();

router.get('/active',getActiveEvents);
router.get('/archive',getArchiveEvents);
router.get('/latest',getLatestEvents);
router.get('/:id',getSingleEvent);
router.post('/register',  authMiddleware,registerToEvent);
router.post('/cancel', authMiddleware,cancelRegistration);
router.get('/status/:event_id',authMiddleware,checkRegistrationStatus);

export default router;