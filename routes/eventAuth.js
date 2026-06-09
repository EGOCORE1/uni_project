import express from 'express';
import { getActiveEvents, getArchiveEvents, getSingleEvent, getLatestEvents } from '../controllers/eventControllers.js';

const router = express.Router();

router.get('/active', getActiveEvents);
router.get('/archive', getArchiveEvents);
router.get('/latest', getLatestEvents);
router.get('/:id', getSingleEvent);

export default router;