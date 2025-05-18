import { Router, Request, Response } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import mongoose, { ObjectId } from 'mongoose';
import { Follow } from '../model/Follow';
import { UserService } from '../service/UserService';


export const userRoutes = (passport: PassportStatic, router: Router): Router => {
    const typedRouter = router as any;

    typedRouter.get('/get-user/:id', async (req: Request<{id: string}>, res: Response) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user){
                res.status(500).send("No user found!");
            }

            const userWithCounts = {
                _id: user!._id,
                username: user!.nickname,
            };

            res.status(200).send(userWithCounts);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/get-users', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            const isAdmin = UserService.isAdmin(req.user as string,req)
            if (!isAdmin){
                return res.status(401).send('Admin role required');
            }
            const user = await User.find();

            if (!user){
                res.status(500).send("No user found!");
            }
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/get-auth-id', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const user = await User.findById(req.user as string);
            if (!user){
                res.status(500).send("No user found!");
            }
            res.status(200).send(user);
        } catch (error) {
            res.status(500).send(error);
        }
    });

    typedRouter.get('/isAdmin', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        try {
            const user = await User.findById(req.user as string);

            if (!user){
                res.status(500).send("No user found!");
            }

            let isAdmin = false
            if (user && user.admin){
                isAdmin = true
            }
            res.status(200).send(isAdmin);
        } catch (error) {
            res.status(500).send(error);
        }
    });


    typedRouter.post('/follow', async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        const followerId = req.user as string
        const {followingId} = req.body;

        if (!mongoose.Types.ObjectId.isValid(followingId) && !mongoose.Types.ObjectId.isValid(followerId)) {
            return res.status(400).send('Invalid user ID.');
        }

        try {
            const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });
            if (existingFollow) {
                return res.status(409).send('Already following this user.');
            }

            const follow = new Follow({
                follower: followerId,
                following: followingId
            });

            await follow.save();
            res.status(201).send({ message: 'Followed successfully' });
        } catch (error) {
            res.status(500).send(error);
        }
    });


    typedRouter.get('/isfollow/:id', async (req: Request<{id: string}>, res: Response) => {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }

        const followerId = req.user as string; // Assuming req.user is a valid user object
        const followingId  = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(followingId)) {
            return res.status(400).send('Invalid user ID.');
        }

        if (followingId == followerId){
            return res.status(201).send({
                isFollowed: false,
                isSameId: true
            })
        }

        try {
            let isFollowed = false
            const isFollowing = await Follow.exists({ follower: followerId, following: followingId });
            if (isFollowing){
                isFollowed = true
            }

            res.status(200).send({
                isFollowed: isFollowed,
                isSameId: false
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });

    return router
}