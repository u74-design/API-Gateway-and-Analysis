import express from "express";
import { RegisterApi, GetmyApis } from "../controllers/api.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/register',protectedRoute, RegisterApi);
router.get('/my-apis',protectedRoute,GetmyApis);

export default router;