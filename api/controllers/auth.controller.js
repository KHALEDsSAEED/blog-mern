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

    if (req.body.username.length < 7 || req.body.username.length > 20) {
        return next(
            errorHandler(400, 'Username must be between 7 and 20 characters')
        );
    }
    if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
        return next(
            errorHandler(400, 'Username can only contain letters and numbers')
        );
    }

    if (password.length < 6) {
        return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    
    const hashedPassword = bcryptjs.hashSync(password, 10); // Hash the password befor save it in the database



    const user = await User.findOne({ email });
    if (user) {
        next(errorHandler(400, 'Email already exists.'));
    }
    else {
        const newUser = new User({ // Create a new user object
            username,
            email,
            password: hashedPassword,
        });

        try {
            await newUser.save(); // Save the user object in the database
            res.json("User created successfully");
        }
        catch (error) {
            next(error);
        }
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required !'));
    }

    try {
        const validUser = await User.findOne({ email }); // Find the user by email
        if (!validUser) { // If the user not found
            return next(errorHandler(404, 'User not found !'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password); // Compare the password with the hashed password
        if (!validPassword) { // If the password is invalid
            return next(errorHandler(400, 'Invalid password !'));
        }

        const token = jwt.sign( // Create a token
            {
                id: validUser._id // Add the user id to the token payload
            },
            process.env.JWT_SECRET, // Add the secret key to the token
        );

        const { password: pass, ...rest } = validUser._doc; // Remove the password from the user object

        res.status(200).cookie('token', token, { // Send the token in a cookie
            httpOnly: true,
        }).json(rest);


    }
    catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { name, email, googlePhotoURL } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign( // Create a token
                {
                    id: user._id // Add the user id to the token payload
                },
                process.env.JWT_SECRET, // Add the secret key to the token
            );
            const { password, ...rest } = user._doc; // Remove the password from the user object
            res.status(200).cookie('token', token, { // Send the token in a cookie
                httpOnly: true,
            }).json(rest);
        }
        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8); // Generate a random password
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // Hash the password befor save it in the database
            const newUser = new User({ // Create a new user object
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4), // Generate a username
                email,
                password: hashedPassword,
                profilePicture: googlePhotoURL,
            });
            await newUser.save(); // Save the user object in the database
            const token = jwt.sign( // Create a token
                {
                    id: newUser._id // Add the user id to the token payload
                },
                process.env.JWT_SECRET, // Add the secret key to the token
            );
            const { password, ...rest } = newUser._doc; // Remove the password from the user object
            res.status(200).cookie('token', token, { // Send the token in a cookie
                httpOnly: true,
            }).json(rest);
        }
    }
    catch (error) {
        next(error);
    }
};