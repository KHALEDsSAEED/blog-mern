import Post from '../models/post.model.js';
import { errorHandler } from '../utils/error.js';

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post'));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Please provide all required fields'));
    }
    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
};

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0; // Default value is 0 if not provided 
        const limit = parseInt(req.query.limit) || 9; // Default value is 9 if not provided
        const sortDiretion = req.query.order === 'asc' ? 1 : -1; // if 1 then ascending, if -1 then descending
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [ // or is used to search for a term in multiple fields
                    { title: { $regex: req.query.searchTerm, $options: 'i' } }, // regex is used to search for a term in a string, i is for case-insensitive
                    { content: { $regex: req.query.searchTerm, $options: 'i' } },
                ],
            }),
        }).sort({ createdAt: sortDiretion }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const timeNow = new Date();

        const oneMonthAgo = new Date(
            timeNow.getFullYear(),
            timeNow.getMonth() - 1,
            timeNow.getDate(),
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }, // gte is used to get the posts created after the date
        });

        res.status(200).json({ posts, totalPosts, lastMonthPosts });

    } catch (error) {
        next(error);
    }
};
