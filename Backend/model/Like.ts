export {};

import mongoose, { Document, Schema, Model } from 'mongoose';

interface ILike extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    tweetId: mongoose.Schema.Types.ObjectId;
    username: string,
    createdAt: Date;
}

const LikeSchema: Schema<ILike> = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tweetId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Tweet', 
        required: true 
    },
    username: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const Like: Model<ILike> = mongoose.model<ILike>('Like', LikeSchema);
