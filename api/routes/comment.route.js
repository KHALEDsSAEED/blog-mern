import express from 'express';
import { createcomment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.post('/create', verifyToken, createcomment);

export default router;