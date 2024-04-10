import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';


dotenv.config(); // Load .env file

mongoose
    .connect(process.env.MONGO) // Connect to MongoDB using a secure methode (password is hidden in .env file)
    .then(() => {
        console.log('Connected to MongoDB !');
    }).catch((error) => {
        console.log('Error: ', error);
    });

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000 !');
});

app.use('/api/user', userRoutes); // Use the userRoutes for the '/api/user/test' endpoint