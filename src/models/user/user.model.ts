import {Schema, model} from "mongoose";
import {IUser} from "../../interfaces/user/user.interface";
export const UserSchema = new Schema(
    {
        username: {type: String, required: [true, "Username is required"]},
        email: {type: String, required: [true, "Email is required"]},
        password: {type: String, required: [true, "Password is required"]},
        role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER'},
    },
    {versionKey: false}
);

const User = model<IUser>("User", UserSchema);

export default User;
