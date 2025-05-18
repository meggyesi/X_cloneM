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
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureRoutes = void 0;
const main_class_1 = require("../main-class");
const User_1 = require("../model/User");
const openaiService_1 = require("../service/openaiService");
const configureRoutes = (passport, router) => {
    router.get('/', (req, res) => {
        let myClass = new main_class_1.MainClass();
        res.status(200).send('Hello, World!');
    });
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query.then((data) => {
                res.status(200).send(data);
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.delete('/deleteUser', (req, res) => {
        if (req.isAuthenticated()) {
            const id = req.query.id;
            const query = User_1.User.deleteOne({ _id: id });
            query.then((data) => {
                res.status(200).send(data);
            }).catch((error) => {
                console.log(error);
                res.status(500).send('Internal server error.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.post('/askChatGPT', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (req.isAuthenticated()) {
            const { message } = req.body;
            if (!message) {
                res.status(400).send('Missing message in request body.');
                return;
            }
            try {
                const response = yield (0, openaiService_1.askChatGPT)(message);
                res.status(200).json({ response });
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Failed to get response from ChatGPT.');
            }
        }
        else {
            res.status(401).send('User is not logged in.');
        }
    }));
    return router;
};
exports.configureRoutes = configureRoutes;
