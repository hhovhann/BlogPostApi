import mongoose, {Document} from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: Array<mongoose.Schema.Types.ObjectId>;
}
