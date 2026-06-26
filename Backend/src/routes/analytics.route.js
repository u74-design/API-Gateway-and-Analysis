import express from 'express';

import { GetAnalyticsSummary } from '../controllers/analytics.contoller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/:apiId",protectedRoute,GetAnalyticsSummary);

export default router;