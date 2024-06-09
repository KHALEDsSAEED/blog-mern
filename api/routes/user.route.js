import express from 'express';
import { test, updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test); 
// The verifyToken middleware is used to check if the user is authenticated and the user is the same as the one to be updated
router.put('/update/:userId', verifyToken, updateUser);
// The verifyToken middleware is used to check if the user is authenticated and the user is the same as the one to be deleted
router.delete('/delete/:userId', verifyToken, deleteUser);

export default router;