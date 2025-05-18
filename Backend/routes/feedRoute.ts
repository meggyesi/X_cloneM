import express, { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import mongoose, { ObjectId } from 'mongoose';
import { Tweet } from '../model/Tweet';
import { Like } from '../model/Like';
import { TweetComment } from '../model/TweetComment';
import { Follow } from '../model/Follow';
import { UserService } from '../service/UserService';
import * as repl from "repl";

export const feedRoutes = (passport: PassportStatic, router: Router): Router => {
    const typedRouter = router as any;

    typedRouter.post('/tweet', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        
        try {
            const userid = req.user as string;
            const user = await User.findById(userid);
                
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const username = user?.nickname
            const {text,parentId} = req.body
            if (!mongoose.Types.ObjectId.isValid(userid)) {
                return res.status(400).send('Invalid user ID.');
            }
            
            const tweetData = {
                userId: userid,
                username: username,
                text: text,
                parentId:null
            };

            if (parentId) {
                if (!mongoose.Types.ObjectId.isValid(parentId)) {
                    return res.status(400).send('Invalid parent ID.');
                }
                tweetData.parentId = parentId;
            }
            const tweet = new Tweet(tweetData)
            await tweet.save();
            return res.status(201).send(tweet);
        } catch (error: any) {
            return res.status(500).send(error);
        }
    });
    
    typedRouter.post('/like', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            const userId = req.user as string;
            const user = await User.findById(userId);
                
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const username = user.nickname
            const { tweetId } = req.body;
            
            if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tweetId)) {
                return res.status(400).send('Invalid userId or tweetId.');
            }
    
            const tweetExists = await Tweet.findById(tweetId);
            const commentExists = await TweetComment.findById(tweetId);
            if ((!tweetExists && !commentExists) || (tweetExists && commentExists)) {
                return res.status(404).send('Tweet not found.');
            }

            const existingLike = await Like.findOne({ userId, tweetId });
            if (existingLike) {
                return res.status(409).send('Like already exists.');
            }
    
            const like = new Like({
                userId: userId,
                tweetId: tweetId,
                username: username
            });
            
            await like.save();
            const likeCount = await Like.countDocuments({ tweetId });

            res.status(201).send({
                like: like,
                status: likeCount
            });
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.post('/comments/:parentId', async (req: Request<{parentId: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
        try {
            const parentId = req.params.parentId;
            const { text } = req.body;
            const userId = req.user as string;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).send('User not found.');
            }
            const username = user.nickname;

            const comment = new TweetComment({
                text,
                userId,
                username,
                tweetId: parentId,
                createdAt: new Date()
            });
            await comment.save();
            res.status(201).send(comment);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/tweets', async (req: Request, res: Response) => {
        try {
            const tweets = await Tweet.find();
            res.status(200).send(tweets);
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/tweetswithcount', async (req: Request, res: Response) => {
        try {
            const tweets = await Tweet.find()
            .sort({ createdAt: -1 });
    
            const tweetsWithCounts = await Promise.all(tweets.map(async (tweet: any) => {
                const likeCount = await Like.countDocuments({ tweetId: tweet._id });
                const commentCount = await TweetComment.countDocuments({ tweetId: tweet._id });
                return {
                    ...tweet.toObject(),
                    likeCount,
                    commentCount
                };
            }));
    
            res.status(200).send(tweetsWithCounts);
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/commentswithcount/:parentId', async (req: Request<{parentId: string}>, res: Response) => {
        try {
            const parentId = req.params.parentId as string;
            if (!parentId) {
                return res.status(400).send('Parent ID is required');
            }

            const comments = await TweetComment.find({ tweetId: parentId }).sort({ createdAt: -1 });

            res.status(200).send(comments);
        } catch (error: any) {
            res.status(500).send(error);
        }
    });
    
    typedRouter.get('/tweets/:id', async (req: Request<{id: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            const tweet = await Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }

            const likeCount = await Like.countDocuments({ tweetId: tweet._id });
            const commentCount = await TweetComment.countDocuments({ tweetId: tweet._id });

            res.status(200).send({
                tweet,
                likeCount,
                commentCount
            });
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/tweet-user/:userId', async (req: Request<{userId: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            let userId = req.params.userId as string

            const tweets = await Tweet.find({ userId: req.params.userId, parentId: null });

            if (!tweets) {
                return res.status(404).send('Tweets not found for the user.');
            }

            const tweetsWithCounts = [];

            for (const tweet of tweets) {
                const likeCount = await Like.countDocuments({ tweetId: tweet._id });
                const commentCount = await TweetComment.countDocuments({ tweetId: tweet._id });

                tweetsWithCounts.push({
                    tweet,
                    likeCount,
                    commentCount
                });
            }

            res.status(200).send(tweetsWithCounts);
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/tweet-user-replies/:userId', async (req: Request<{userId: string}>, res: Response) => {
        try {
            if (!req.isAuthenticated()) {
                return res.status(401).send('User is not authenticated.');
            }

            let userId = req.params.userId as string;

            const replyTweets = await Tweet.find({ userId: userId, parentId: { $ne: null } }).sort({ createdAt: -1 });

            const replyMap = new Map();

            for (const replyTweet of replyTweets) {
                const parentTweet = await Tweet.findById(replyTweet.parentId);

                if (parentTweet) {
                    const parentId = parentTweet._id as string;
                    if (!replyMap.has(parentId)) {
                        replyMap.set(parentId, { parentTweet: parentTweet, replies: [] });
                    }
                    replyMap.get(parentId).replies.push(replyTweet);
                }
            }

            const tweetsWithReplies = Array.from(replyMap.values());

            res.status(200).send(tweetsWithReplies);
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/check-like/:tweetId', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
    
        try {
            const userId = req.user as string;
            const tweetId = req.params.tweetId;
    
            const existingLike = await Like.findOne({ userId, tweetId });
    
            const isLiked = !!existingLike;
    
            res.status(200).json({
                isLiked: isLiked
            });
        } catch (error: any) {
            console.error('Error checking like:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    typedRouter.get('/check-tweet/:userId', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            const authuserId = req.user as string;
            const userId = req.params.userId;
            let checkTweet = false
            if (authuserId == userId){
                checkTweet = !checkTweet
            }

            res.status(200).json({
                checkTweet: checkTweet
            });
        } catch (error: any) {
            console.error('Error checking like:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    typedRouter.patch('/tweets/:id', async (req: Request<{id: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            const text = req.body.text;
            const currentUser = req.user as any;
            const currentUserId = currentUser._id;

            const tweet = await Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }
            
            if (tweet.userId.toString() !== currentUserId.toString()) {
                return res.status(403).send('Unauthorized: You can only update your own tweets');
            }

            const tweetresult = await Tweet.findByIdAndUpdate(req.params.id, { text }, { new: true });
            if (!tweetresult) {
                return res.status(404).send('Tweet not found');
            }
            
            res.status(200).send(tweetresult);
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.delete('/unlike/:tweetId', async (req: Request<{tweetId: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            const userId = req.user as string;
            const user = await User.findById(userId);
                
            if (!user) {
                return res.status(404).send('User not found.');
            }

            const tweetId = req.params.tweetId;
            
            const tweetExists = await Tweet.findById(tweetId);
            const commentExists = await TweetComment.findById(tweetId);
            if ((!tweetExists && !commentExists) || (tweetExists && commentExists)) {
                return res.status(404).send('Tweet not found.');
            }
            
            const like = await Like.findOneAndDelete({ userId, tweetId });
            if (!like) {
                return res.status(404).send('Like not found or already removed.');
            }

            const likeCount = await Like.countDocuments({ tweetId });

            res.status(201).send({
                like: like,
                status: likeCount
            });
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    typedRouter.delete('/comments/:id', async (req: Request<{id: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }
    
        try {
            const commentId = req.params.id;
            const currentUserId = req.body.currentUserId

            if (!mongoose.Types.ObjectId.isValid(commentId) || !mongoose.Types.ObjectId.isValid(currentUserId)) {
                return res.status(400).send('Invalid userId or tweetId.');
            }
    
            const comment = await TweetComment.findById(commentId);
            if (!comment) {
                return res.status(404).send('Comment not found.');
            }
    
            if (!comment.userId != currentUserId) {
                return res.status(403).send('Unauthorized: You can only delete your own comments.');
            }
    
            await TweetComment.findByIdAndDelete(commentId);
            res.status(200).send({ message: 'Comment successfully deleted.' });
        } catch (error: any) {
            res.status(500).send(error);
        }
    });
    
    typedRouter.delete('/tweets/:id', async (req: Request<{id: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('User is not authenticated.');
        }

        try {
            const currentUserId = req.user as mongoose.Schema.Types.ObjectId

            const isAdmin:boolean = await UserService.isAdmin(req.user as string, req)

            const tweet = await Tweet.findById(req.params.id);
            if (!tweet) {
                return res.status(404).send('Tweet not found');
            }

            if (tweet.userId != currentUserId && !isAdmin) {
                return res.status(403).send('Unauthorized: You can only delete your own tweets');
            }
            
            const result = await Tweet.findByIdAndDelete(req.params.id);
            if (!result) {
                return res.status(404).send('Delete canceled');
            }
            res.status(200).send({ message: 'Tweet deleted successfully' });
        } catch (error: any) {
            res.status(500).send(error);
        }
    });

    return router;
}