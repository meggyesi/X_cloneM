export {};

import mongoose, { Document, Schema, Model } from 'mongoose';

interface ITweet extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    username: string,
    text: string;
    createdAt: Date;
    parentId: mongoose.Schema.Types.ObjectId;
    isComment: boolean
}

const TweetSchema: Schema<ITweet> = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, maxlength: 280 },
    createdAt: { type: Date, default: Date.now },
    parentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: null, required: false},
    isComment: {type: Boolean, default: false, required: false}
});

export const Tweet: Model<ITweet> = mongoose.model<ITweet>('Tweet', TweetSchema);
