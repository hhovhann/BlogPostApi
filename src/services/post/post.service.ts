import {IPost} from "../../interfaces/post/post.interface";
import Post from "../../models/post/post.model";
import APIError from "../../errors/api.error";

export class PostService {

    /**
     * Search the post by title or content
     * **/
    public search(query: string): Promise<IPost[]> {
        return Post.find({
            '$or': [
                {'title': {'$regex': query.trim().toLowerCase(), '$options': 'i'}},
                {'content': {'$regex': query.trim().toLowerCase(), '$options': 'i'}}
            ]
        }).sort({"createdAt": 1, "title": 1}).exec();
    }

    /**
     * Find the post by id
     * **/
    public findById(id: string): Promise<IPost> {
        // @ts-ignore
        return Post.findById(id).exec();
    }

    /**
     * Find all posts
     * **/
    public find(limit: number, page: number): Promise<IPost[]> {
        return Post.find()
            // We multiply the "limit" variables by one just to make sure we pass a number and not a string
            .limit(limit)
            // I don't think i need to explain the math here
            .skip((page - 1) * limit)
            // We sort the data by the date of their creation in descending order (user 1 instead of -1 to get ascending order)
            .sort({"createdAt": -1, "title": -1}).exec();
    }

    /**
     * Add new post
     * **/
    public add(post: IPost): Promise<IPost> {
        // Validate title and content fields
        if (!post.title) {
            throw new APIError('mandatory_field', 404, true, 'Title is mandatory');
        }

        if (!post.content) {
            throw new APIError('mandatory_field', 404, true, 'Content is mandatory');
        }

        const newPost = new Post(post);
        return newPost.save();
    }

    /**
     * Delete the existing post by his Identifier
     * **/
    public async delete(id: string) {
        // const deletePost: Promise<IPost> =
        const deletePost = await Post.findByIdAndDelete(id).exec();

        if (!deletePost) {
            throw new APIError('not_found', 404, true, `Post with id '${id} not found`);
        }

        return deletePost;
    }

    /**
     * Modify the post by his Identifier
     * **/
    public async update(id: string, post: IPost) {
        const updatedPost = await Post.findByIdAndUpdate(id, post).exec();

        if (!updatedPost) {
            throw new APIError('not_found', 404, true, `Post with id '${id} not found`);

        }

        return updatedPost;
    }
}
