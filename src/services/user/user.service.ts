import {IUser} from "../../interfaces/user/user.interface";
import User from "../../models/user/user.model";

const bcrypt = require('bcrypt');

export class UserService {

    /**
     * Register User
     * **/
    public async register(user: IUser): Promise<IUser> {
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
