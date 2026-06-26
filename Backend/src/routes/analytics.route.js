import express from 'express';

import { GetAnalyticsSummary, GetAnalyticsHistory} from '../controllers/analytics.contoller.js';
import { protectedRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/:apiId",protectedRoute,GetAnalyticsSummary);
router.get("/:apiId/history",protectedRoute,GetAnalyticsHistory);

export default router;