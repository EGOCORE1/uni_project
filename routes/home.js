import express from 'express';

import { getRealStats, getGoals } from '../controllers/eventControllers.js';

const router = express.Router();
router.get('/stats', getRealStats);
router.get('/goals', getGoals);

export default router;