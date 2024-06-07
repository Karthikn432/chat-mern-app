import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { getUsersForSidebars } from '../controllers/user.controller.js';
import { getUsersAndGroupChats } from '../controllers/groupChat.controller.js';

const router = express.Router();

router.route('/').get(protectRoute, getUsersAndGroupChats);
router.route('/getusers').get(protectRoute, getUsersForSidebars);


export default router;