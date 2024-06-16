import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies, extract the token from the cookie

dotenv.config(); // Load .env file

mongoose
    .connect(process.env.MONGO) // Connect to MongoDB using a secure methode (password is hidden in .env file)
    .then(() => {
        console.log('Connected to MongoDB !');
    }).catch((error) => {
        console.log('Error: ', error);
    });

const __dirname = path.resolve(); // Define the path to the root directory


app.listen(3000, () => {
    console.log('Server is running on port 3000 !');
});

app.use('/api/user', userRoutes); // Use the userRoutes for the '/api/user/test' endpoint

app.use('/api/auth', authRoutes); // Use the authRoutes for the '/api/auth/signup' endpoint

app.use('/api/post', postRoutes); // Use the postRoutes for the '/api/post/create' endpoint

app.use('/api/comment', commentRoutes); // Use the commentRoutes for the '/api/comment/create' endpoint

app.use(express.static(path.join(__dirname, '/client/dist'))); // Serve the static files from the React app

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        sucess: false,
        statusCode,
        message,
    });
});