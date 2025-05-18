"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    tweetId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tweet', required: true },
    text: { type: String, required: true, maxlength: 280 },
    createdAt: { type: Date, default: Date.now }
});
exports.TweetComment = mongoose_1.default.model('Comment', CommentSchema);
