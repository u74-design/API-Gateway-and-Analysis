import express from 'express';
import { RegisterUser, LoginUser, GetProfile} from "../controllers/auth.controller.js";
import { protectedRoute } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post('/register',RegisterUser);
router.post('/login', LoginUser);
router.get('/profile',protectedRoute,GetProfile);
export default router;

