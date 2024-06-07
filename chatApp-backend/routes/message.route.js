import express from 'express';
import { deleteMessage, editMessage, getLastMessageTime, getMessage, getUnreadMessagesCount, markMessagesAsViewed, sendMessage, uploadFiles } from '../controllers/message.controller.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.route('/send/:id').post(protectRoute,sendMessage);
router.route('/upload_file/:id').post(uploadFiles)
router.route('/:id').get(protectRoute,getMessage);
router.route('/lastseen/:id').get(protectRoute,getLastMessageTime);
router.route('/edit/:id').patch(protectRoute,editMessage)
router.route('/delete/:id').delete(protectRoute,deleteMessage)
router.route('/markMessagesAsViewed').post(protectRoute, markMessagesAsViewed)
router.route('/unread/:id').get(protectRoute, getUnreadMessagesCount)



export default router;