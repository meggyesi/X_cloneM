import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { RequestHandler } from 'express';

export const authRoutes = (passport: PassportStatic, router: Router): Router => {
    router.get('/checkAuth', (req: Request, res: Response) => {
        console.log('Called cehckAuth')
        if (req.isAuthenticated()) {
            console.log('Auth is true')
            res.status(200).send(true);            
        } else {
            console.log('Auth is false')
            res.status(401).send(false);
        }
    });

    router.post('/register', ((req: Request, res: Response) => {
        console.log('Registration request body:', req.body);
        const email = req.body.email;
        const password = req.body.password;
        const nickname = req.body.nickname;
        const birthday = new Date(req.body.birth + 'T00:00:00.000Z');
        
        if (isNaN(birthday.getTime())) {
            return res.status(400).send('Invalid date format');
        }

        const user = new User({
            email: email,
            password: password,
            nickname: nickname,
            birthday: birthday,
            admin: false
        });
        user.save().then((data: any) => {
            res.status(200).send(data);
        }).catch((error: any) => {
            console.error('Registration error:', error);
            res.status(500).send(error);
        });
    }) as RequestHandler);

    router.post('/logout', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            req.logout((error: any) => {
                if (error) {
                    console.log(error);
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });

    return router;
}