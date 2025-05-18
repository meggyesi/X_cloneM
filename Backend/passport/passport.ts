import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../model/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

    passport.serializeUser((user: Express.User, done) => {
        console.log('user is serialized.');
        done(null, user);
    });

    passport.deserializeUser(async (user: Express.User, done) => {
        console.log('user is deserialized.');
        try {
            const foundUser = await User.findById(user);
            done(null, foundUser);
        } catch (error) {
            done(error);
        }
    });

    passport.use('local', new Strategy((username, password, done) => {
        const query = User.findOne({ email: username });
        query.then((user: any) => {
            if (user) {
                user.comparePassword(password, (error: any, _: any) => {
                    if (error) {
                        done('Incorrect username or password.');
                    } else {
                        done(null, user);
                    }
                });
            } else {
                done(null, undefined);
            }
        }).catch((error: any) => {
            done(error);
        })
    }));

    return passport;
}