"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Follow = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const FollowSchema = new mongoose_1.default.Schema({
    follower: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });
exports.Follow = mongoose_1.default.model('Follow', FollowSchema);
