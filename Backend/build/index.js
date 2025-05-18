"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./passport/passport");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = require("./routes/authRoutes");
const feedRoute_1 = require("./routes/feedRoute");
const userRoutes_1 = require("./routes/userRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const app = (0, express_1.default)();
const port = 5001;
const dbUrl = 'mongodb://localhost:5000/x_clone';
dotenv_1.default.config();
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
const sessionOptions = {
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
app.use((0, express_session_1.default)(sessionOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.configurePassport)(passport_1.default);
app.use('/api', chatRoute_1.default);
app.use('/app', (0, routes_1.configureRoutes)(passport_1.default, express_1.default.Router()));
app.use('/auth', (0, authRoutes_1.authRoutes)(passport_1.default, express_1.default.Router()));
app.use('/feed', (0, feedRoute_1.feedRoutes)(passport_1.default, express_1.default.Router()));
app.use('/user', (0, userRoutes_1.userRoutes)(passport_1.default, express_1.default.Router()));
mongoose_1.default.connect(dbUrl).then((_) => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log(error);
    return;
});
app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});
console.log('After server is ready.');
