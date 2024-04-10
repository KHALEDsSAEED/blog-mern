import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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