import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

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

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required !'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found !'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password !'));
        }

        const token = jwt.sign(
            {
                id: validUser._id // Add the user id to the token payload
            },
            process.env.JWT_SECRET, // Add the secret key to the token
            {
                expiresIn: '2h' // Set the token expiration time
            }
        );

        const { password: pass, ...rest } = validUser._doc; // Remove the password from the user object

        res.status(200).cookie('token', token, {
            httpOnly: true,
        }).json(rest);


    }
    catch (error) {
        next(error);
    }

};