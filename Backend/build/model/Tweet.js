"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tweet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TweetSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, maxlength: 280 },
    createdAt: { type: Date, default: Date.now },
    parentId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Tweet', default: null, required: false },
    isComment: { type: Boolean, default: false, required: false }
});
exports.Tweet = mongoose_1.default.model('Tweet', TweetSchema);
