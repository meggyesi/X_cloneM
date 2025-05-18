import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IComment extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    username: string;
    tweetId: mongoose.Schema.Types.ObjectId;
    text: string;
    createdAt: Date;
    likeCount?: string;
    commentCount?: string;
}

const CommentSchema: Schema<IComment> = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
    text: { type: String, required: true, maxlength: 280 },
    createdAt: { type: Date, default: Date.now }
});

export const TweetComment: Model<IComment> = mongoose.model<IComment>('Comment', CommentSchema);