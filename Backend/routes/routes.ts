import { Router, Request, Response, NextFunction } from 'express';
import { MainClass } from '../main-class';
import { PassportStatic } from 'passport';
import { User } from '../model/User';
import { askChatGPT } from '../service/openaiService';


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.get('/', (req: Request, res: Response) => {
        let myClass = new MainClass();
        res.status(200).send('Hello, World!');
    });

    router.get('/getAllUsers', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const query = User.find();
            query.then((data: any) => {
                res.status(200).send(data);
            }).catch((error: any) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });


    router.delete('/deleteUser', (req: Request, res: Response) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User.deleteOne({_id: id});
            query.then((data: any) => {
                res.status(200).send(data);
            }).catch((error: any) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            })
        } else {
            res.status(500).send('User is not logged in.');
        }
    });

    router.post('/askChatGPT', async (req: Request, res: Response): Promise<void> => {
        if (req.isAuthenticated()) {
            const { message } = req.body;

            if (!message) {
                res.status(400).send('Missing message in request body.');
                return;
            }

            try {
                const response = await askChatGPT(message);
                res.status(200).json({ response });
            } catch (error) {
                console.error(error);
                res.status(500).send('Failed to get response from ChatGPT.');
            }
        } else {
            res.status(401).send('User is not logged in.');
        }
    });

    return router;
}