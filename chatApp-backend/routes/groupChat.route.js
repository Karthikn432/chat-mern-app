import express from 'express';
import { protectRoute } from '../middlewares/protectRoute.js';
import { createGroupChat, getGroupChatsForParticipants } from '../controllers/groupChat.controller.js';

const router = express.Router();

router.route('/create-new-group').post(protectRoute,createGroupChat);
router.route('/getGroupChat').post(protectRoute,getGroupChatsForParticipants);

export default router;