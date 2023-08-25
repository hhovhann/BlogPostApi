import {Schema, model} from "mongoose";
import {IPost} from "../../interfaces/post/post.interface";

export const PostSchema = new Schema(
    {
        title: {type: String, trim: true, required: [true, "Field is required"]},
        content: {type: String, trim: true, required: [true, "Field is required"]},
        author: {type: String, trim: true},
        createdAt: {type: Date, default: Date.now},
    },
    {versionKey: false}
);

const Post = model<IPost>("Post", PostSchema);

export default Post;
