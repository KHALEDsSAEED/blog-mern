import express from 'express';
import { createcomment, getPostComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/create', verifyToken, createcomment);
router.get('/getpostscomment/:postId', getPostComments);

export default router;