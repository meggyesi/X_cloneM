"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const User_1 = require("../model/User");
const authRoutes = (passport, router) => {
    // Check authentication status
    router.get('/checkAuth', (req, res) => {
        console.log('Called cehckAuth');
        if (req.isAuthenticated()) {
            console.log('Auth is true');
            res.status(200).send(true);
        }
        else {
            console.log('Auth is false');
            res.status(401).send(false);
        }
    });
    // User registration handler
    router.post('/register', ((req, res) => {
        console.log('Registration request body:', req.body);
        const email = req.body.email;
        const password = req.body.password;
        const nickname = req.body.nickname;
        const birthday = new Date(req.body.birth + 'T00:00:00.000Z');
        if (isNaN(birthday.getTime())) {
            return res.status(400).send('Invalid date format');
        }
        const user = new User_1.User({
            email: email,
            password: password,
            nickname: nickname,
            birthday: birthday,
            admin: false
        });
        user.save().then((data) => {
            res.status(200).send(data);
        }).catch((error) => {
            console.error('Registration error:', error);
            res.status(500).send(error);
        });
    }));
    // Handle user logout
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    // Process login attempts
    router.post('/login', (req, res, next) => {
        passport.authenticate('local', (error, user) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send('User not found.');
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        }
                        else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    return router;
};
exports.authRoutes = authRoutes;
