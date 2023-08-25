import mongoose, {Schema, model} from "mongoose";
import {IUser} from "../../interfaces/user/user.interface";

export const UserSchema = new Schema(
    {
        username: {type: String, required: [true, "Field is required"]},
        email: {type: String, required: [true, "Field is required"]},
        password: {type: String, required: [true, "Field is required"]},
        roles: [{type: mongoose.Schema.Types.ObjectId, ref: "Role"}]
    },
    {versionKey: false}
);

const User = model<IUser>("User", UserSchema);

export default User;
