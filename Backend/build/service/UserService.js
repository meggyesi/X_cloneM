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
exports.UserService = void 0;
const User_1 = require("../model/User");
class UserService {
    static isAdmin(userId, req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.isAuthenticated()) {
                return false;
            }
            try {
                // Find the user with the given userID
                const user = yield User_1.User.findById(userId);
                if (!user) {
                    return false;
                }
                else
                    return !!user.admin;
            }
            catch (error) {
                console.error('Error retrieving user:', error);
                return false;
            }
        });
    }
}
exports.UserService = UserService;
