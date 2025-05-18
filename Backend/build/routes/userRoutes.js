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
exports.userRoutes = void 0;
const User_1 = require("../model/User");
const mongoose_1 = __importDefault(require("mongoose"));
const Follow_1 = require("../model/Follow");
const UserService_1 = require("../service/UserService");
const userRoutes = (passport, router) => {
    const typedRouter = router;
    typedRouter.get('/get-user/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield User_1.User.findById(req.params.id);
            if (!user) {
                res.status(500).send("No user found!");
            }
            const userWithCounts = {
                _id: user._id,
                username: user.nickname,
            };
            res.status(200).send(userWithCounts);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/get-users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const isAdmin = UserService_1.UserService.isAdmin(req.user, req);
            if (!isAdmin) {
                return res.status(401).send('Admin role required');
            }
            const user = yield User_1.User.find();
            if (!user) {
                res.status(500).send("No user found!");
            }
            res.status(200).send(user);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/get-auth-id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                res.status(500).send("No user found!");
            }
            res.status(200).send(user);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/isAdmin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        try {
            const user = yield User_1.User.findById(req.user);
            if (!user) {
                res.status(500).send("No user found!");
            }
            let isAdmin = false;
            if (user && user.admin) {
                isAdmin = true;
            }
            res.status(200).send(isAdmin);
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.post('/follow', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        const followerId = req.user;
        const { followingId } = req.body;
        if (!mongoose_1.default.Types.ObjectId.isValid(followingId) && !mongoose_1.default.Types.ObjectId.isValid(followerId)) {
            return res.status(400).send('Invalid user ID.');
        }
        try {
            const existingFollow = yield Follow_1.Follow.findOne({ follower: followerId, following: followingId });
            if (existingFollow) {
                return res.status(409).send('Already following this user.');
            }
            const follow = new Follow_1.Follow({
                follower: followerId,
                following: followingId
            });
            yield follow.save();
            res.status(201).send({ message: 'Followed successfully' });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    typedRouter.get('/isfollow/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Authentication required');
        }
        const followerId = req.user; // Assuming req.user is a valid user object
        const followingId = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(followingId)) {
            return res.status(400).send('Invalid user ID.');
        }
        if (followingId == followerId) {
            return res.status(201).send({
                isFollowed: false,
                isSameId: true
            });
        }
        try {
            let isFollowed = false;
            const isFollowing = yield Follow_1.Follow.exists({ follower: followerId, following: followingId });
            if (isFollowing) {
                isFollowed = true;
            }
            res.status(200).send({
                isFollowed: isFollowed,
                isSameId: false
            });
        }
        catch (error) {
            res.status(500).send(error);
        }
    }));
    return router;
};
exports.userRoutes = userRoutes;
