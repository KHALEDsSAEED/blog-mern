import { error } from "console";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password ||
        username === '' || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required !'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10); // Hash the password befor save it in the database

    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        res.json("User created successfully");
    }
    catch (error) {
        next(error);
    }



};