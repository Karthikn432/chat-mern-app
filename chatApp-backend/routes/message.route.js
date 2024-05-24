import express from 'express';
import { getLastMessageTime, getMessage, sendMessage } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.route('/send/:id').post(protectRoute,sendMessage);
router.route('/:id').get(protectRoute,getMessage);
router.route('/lastseen/:id').get(protectRoute,getLastMessageTime);


export default router;