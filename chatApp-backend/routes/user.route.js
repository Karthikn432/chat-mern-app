import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { getUsersForSidebars } from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').get(protectRoute, getUsersForSidebars);


export default router;