import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import path from 'path';
const app = express();

app.use(express.json()); // Parse JSON bodies

dotenv.config(); // Load .env file

mongoose
    .connect(process.env.MONGO) // Connect to MongoDB using a secure methode (password is hidden in .env file)
    .then(() => {
        console.log('Connected to MongoDB !');
    }).catch((error) => {
        console.log('Error: ', error);
    });



app.listen(3000, () => {
    console.log('Server is running on port 3000 !');
});

app.use('/api/user', userRoutes); // Use the userRoutes for the '/api/user/test' endpoint

app.use('/api/auth', authRoutes); // Use the authRoutes for the '/api/auth/signup' endpoint

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        sucess: false,
        statusCode,
        message,
    });
});