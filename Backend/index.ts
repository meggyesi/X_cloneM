import { MainClass } from './main-class';
import express from 'express';
import { Request, Response } from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession  from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';
import { authRoutes } from './routes/authRoutes';
import { feedRoutes } from './routes/feedRoute';
import {userRoutes} from "./routes/userRoutes";
import dotenv from 'dotenv';
import chatRouter from './routes/chatRoute';

const app = express();
const port = 5001;
const dbUrl = 'mongodb://localhost:5000/x_clone';
dotenv.config();

const corsOptions = {
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());

app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/api', chatRouter);
app.use('/app', configureRoutes(passport, express.Router()));
app.use('/auth', authRoutes(passport, express.Router()));
app.use('/feed', feedRoutes(passport, express.Router()));
app.use('/user', userRoutes(passport, express.Router()));

mongoose.connect(dbUrl).then((_) => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log(error);
    return;
});

app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});

console.log('After server is ready.');