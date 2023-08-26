import {IUser} from "../../interfaces/user/user.interface";
import User from "../../models/user/user.model";
import APIError from "../../errors/api.error";
import {HttpStatusCode} from "../../enums/http.statuses";

const bcrypt = require('bcrypt');

export class UserService {

    /**
     * Register User
     * **/
    public async register(user: IUser): Promise<IUser> {
        // Validate username, email, password, and role fields
        if (!user.username) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Username is mandatory');
        }

        if (!user.email) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Email is mandatory');
        }

        // Validate title and content fields
        if (!user.password) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Password is mandatory');
        }

        if (!user.role) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Role is mandatory');
        }

        const password = await bcrypt.hash(user.password, 10);
        const newUser = new User({
            username: user.username,
            email: user.email,
            password: password,
            role: user.role
        });
        return newUser.save();
    }
}
