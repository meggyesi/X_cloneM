export {};

import { Request } from 'express';
import { User } from '../model/User';

export class UserService {
    static async isAdmin(userId: string, req: Request): Promise<any | null> {
        if (!req.isAuthenticated()) {
            return false;
        }
        try {
            const user = await User.findById(userId);
            
            if (!user) {
                return false;
            }
            else return !!user.admin;
        } catch (error) {

            return false;
        }
    }
}
