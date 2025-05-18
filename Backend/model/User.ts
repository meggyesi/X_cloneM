export {};

import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    name?: string;
    address?: string;
    nickname: string;
    password: string;
    birthday?: Date
    admin: boolean
    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: { type: String, required: true },
    nickname: { type: String, required: true },
    password: { type: String, required: true },
    admin: {type: Boolean, required: true},
    birthday: {type: Date, required: true}
});

// hook
UserSchema.pre<IUser>('save', function(next) {
    const user = this;
    
    // hash password
    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void): void {
    const user = this;
    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            callback(error, false);
        }
        callback(null, isMatch);
    });
}

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
