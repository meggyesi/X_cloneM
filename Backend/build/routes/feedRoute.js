"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feedRoutes = void 0;
const User_1 = require("../model/User");
const mongoose_1 = __importDefault(require("mongoose"));
const Tweet_1 = require("../model/Tweet");
const Like_1 = require("../model/Like");
const TweetComment_1 = require("../model/TweetComment");
const UserService_1 = require("../service/UserService");
const feedRoutes = (passport, router) => {
    const typedRouter = router;
    typedRouter.post('/tweet', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const userid = req.user;
            const user = yield User_1.User.findById(userid);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const username = user === null || user === void 0 ? void 0 : user.nickname;
            const { text, parentId } = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(userid)) {
                return res.status(400).send('Invalid user ID.');
            }
            const tweetData = {
                userId: userid,
                username: username,
                text: text,
                parentId: null
            };
            if (parentId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(parentId)) {
                    return res.status(400).send('Invalid parent ID.');
                }
                tweetData.parentId = parentId;
            }
            const tweet = new Tweet_1.Tweet(tweetData);
            yield tweet.save();
            return res.status(201).send(tweet);
        }
        catch (error) {
            return res.status(500).send(error);
        }
    }));
    typedRouter.post('/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const userId = req.user;
            const user = yield User_1.User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const username = user.nickname;
            const { tweetId } = req.body;
            if (!mongoose_1.default.Types.ObjectId.isValid(userId) || !mongoose_1.default.Types.ObjectId.isValid(tweetId)) {
                return res.status(400).send('Invalid userId or tweetId.');
            }
            const tweetExists = yield Tweet_1.Tweet.findById(tweetId);
            const commentExists = yield TweetComment_1.TweetComment.findById(tweetId);
            if ((!tweetExists && !commentExists) || (tweetExists && commentExists)) {
                return res.status(404).send('Tweet not found.');
            }
            const existingLike = yield Like_1.Like.findOne({ userId, tweetId });
            if (existingLike) {
                return res.status(409).send('Like already exists.');
            }
            const like = new Like_1.Like({
                userId: userId,
                tweetId: tweetId,
                username: username
            });
            yield like.save();
            const likeCount = yield Like_1.Like.countDocuments({ tweetId });
            res.status(201).send({
                like: like,
                status: likeCount
            });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.post('/comments/:parentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const parentId = req.params.parentId;
            const { text } = req.body;
            const userId = req.user;
            const user = yield User_1.User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const username = user.nickname;
            const comment = new TweetComment_1.TweetComment({
                text,
                userId,
                username,
                tweetId: parentId,
                createdAt: new Date()
            });
            yield comment.save();
            res.status(201).send(comment);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/tweets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tweets = yield Tweet_1.Tweet.find();
            res.status(200).send(tweets);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/tweetswithcount', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tweets = yield Tweet_1.Tweet.find()
                .sort({ createdAt: -1 });
            const tweetsWithCounts = yield Promise.all(tweets.map((tweet) => __awaiter(void 0, void 0, void 0, function* () {
                const likeCount = yield Like_1.Like.countDocuments({ tweetId: tweet._id });
                const commentCount = yield TweetComment_1.TweetComment.countDocuments({ tweetId: tweet._id });
                return Object.assign(Object.assign({}, tweet.toObject()), { likeCount,
                    commentCount });
            })));
            res.status(200).send(tweetsWithCounts);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/commentswithcount/:parentId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parentId = req.params.parentId;
            if (!parentId) {
                return res.status(400).send('Parent ID is required');
            }
            const comments = yield TweetComment_1.TweetComment.find({ tweetId: parentId }).sort({ createdAt: -1 });
            res.status(200).send(comments);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/tweets/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const tweet = yield Tweet_1.Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }
            const likeCount = yield Like_1.Like.countDocuments({ tweetId: tweet._id });
            const commentCount = yield TweetComment_1.TweetComment.countDocuments({ tweetId: tweet._id });
            res.status(200).send({
                tweet,
                likeCount,
                commentCount
            });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/tweet-user/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            let userId = req.params.userId;
            const tweets = yield Tweet_1.Tweet.find({ userId: req.params.userId, parentId: null });
            if (!tweets) {
                return res.status(404).send('Tweets not found for the user.');
            }
            const tweetsWithCounts = [];
            for (const tweet of tweets) {
                const likeCount = yield Like_1.Like.countDocuments({ tweetId: tweet._id });
                const commentCount = yield TweetComment_1.TweetComment.countDocuments({ tweetId: tweet._id });
                tweetsWithCounts.push({
                    tweet,
                    likeCount,
                    commentCount
                });
            }
            res.status(200).send(tweetsWithCounts);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/tweet-user-replies/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).send('User is not authenticated.');
            }
            let userId = req.params.userId;
            const replyTweets = yield Tweet_1.Tweet.find({ userId: userId, parentId: { $ne: null } }).sort({ createdAt: -1 });
            const replyMap = new Map();
            for (const replyTweet of replyTweets) {
                const parentTweet = yield Tweet_1.Tweet.findById(replyTweet.parentId);
                if (parentTweet) {
                    const parentId = parentTweet._id;
                    if (!replyMap.has(parentId)) {
                        replyMap.set(parentId, { parentTweet: parentTweet, replies: [] });
                    }
                    replyMap.get(parentId).replies.push(replyTweet);
                }
            }
            const tweetsWithReplies = Array.from(replyMap.values());
            res.status(200).send(tweetsWithReplies);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/check-like/:tweetId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const userId = req.user;
            const tweetId = req.params.tweetId;
            const existingLike = yield Like_1.Like.findOne({ userId, tweetId });
            const isLiked = !!existingLike;
            res.status(200).json({
                isLiked: isLiked
            });
        }
        catch (error) {
            console.error('Error checking like:', error);
            res.status(500).send('Internal Server Error');
        }
    }));
    typedRouter.get('/check-tweet/:userId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const authuserId = req.user;
            const userId = req.params.userId;
            let checkTweet = false;
            if (authuserId == userId) {
                checkTweet = !checkTweet;
            }
            res.status(200).json({
                checkTweet: checkTweet
            });
        }
        catch (error) {
            console.error('Error checking like:', error);
            res.status(500).send('Internal Server Error');
        }
    }));
    typedRouter.patch('/tweets/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const text = req.body.text;
            const currentUser = req.user;
            const currentUserId = currentUser._id;
            const tweet = yield Tweet_1.Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }
            if (tweet.userId.toString() !== currentUserId.toString()) {
                return res.status(403).send('Unauthorized: You can only update your own tweets');
            }
            const tweetresult = yield Tweet_1.Tweet.findByIdAndUpdate(req.params.id, { text }, { new: true });
            if (!tweetresult) {
                return res.status(404).send('Tweet not found');
            }
            res.status(200).send(tweetresult);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.delete('/unlike/:tweetId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const userId = req.user;
            const user = yield User_1.User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const tweetId = req.params.tweetId;
            const tweetExists = yield Tweet_1.Tweet.findById(tweetId);
            const commentExists = yield TweetComment_1.TweetComment.findById(tweetId);
            if ((!tweetExists && !commentExists) || (tweetExists && commentExists)) {
                return res.status(404).send('Tweet not found.');
            }
            const like = yield Like_1.Like.findOneAndDelete({ userId, tweetId });
            if (!like) {
                return res.status(404).send('Like not found or already removed.');
            }
            const likeCount = yield Like_1.Like.countDocuments({ tweetId });
            res.status(201).send({
                like: like,
                status: likeCount
            });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.delete('/comments/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const commentId = req.params.id;
            const currentUserId = req.body.currentUserId;
            if (!mongoose_1.default.Types.ObjectId.isValid(commentId) || !mongoose_1.default.Types.ObjectId.isValid(currentUserId)) {
                return res.status(400).send('Invalid userId or tweetId.');
            }
            const comment = yield TweetComment_1.TweetComment.findById(commentId);
            if (!comment) {
                return res.status(404).send('Comment not found.');
            }
            if (!comment.userId != currentUserId) {
                return res.status(403).send('Unauthorized: You can only delete your own comments.');
            }
            yield TweetComment_1.TweetComment.findByIdAndDelete(commentId);
            res.status(200).send({ message: 'Comment successfully deleted.' });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.delete('/tweets/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const currentUserId = req.user;
            const isAdmin = yield UserService_1.UserService.isAdmin(req.user, req);
            const tweet = yield Tweet_1.Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }
            if (tweet.userId != currentUserId && !isAdmin) {
                return res.status(403).send('Unauthorized: You can only delete your own tweets');
            }
            const result = yield Tweet_1.Tweet.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).send('Delete canceled');
            }
            res.status(200).send({ message: 'Tweet deleted successfully' });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    return router;
};
exports.feedRoutes = feedRoutes;
