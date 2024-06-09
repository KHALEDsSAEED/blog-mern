import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test);
// The verifyToken middleware is used to check if the user is authenticated
router.put('/update/:userId', verifyToken, updateUser);

export default router;