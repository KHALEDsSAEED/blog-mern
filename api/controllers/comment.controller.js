import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createcomment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return next(errorHandler(403, 'You are not authorized to perform this action.'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        await newComment.save();
        res.status(200).json(newComment);
    }
    catch (error) {
        next(error);
    }
};