import {NextFunction, Request, Response, Router} from "express";
import {PostService} from "../../services/post/post.service";
import {UserService} from "../../services/user/user.service";

export class PostController {
    public router = Router();

    constructor(private postService: PostService, private userService: UserService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route("/").get(this.findAll);
        this.router.route("/:id").get(this.findById)
        this.router.route("/search/:key").get(this.search);
        this.router.route("/").post(this.userService.validateToken, this.create);
        this.router.route("/").put(this.userService.validateToken, this.update);
        this.router.route("/:id").delete(this.userService.validateToken, this.delete).put(this.update);
    }

    private search = async (request: Request, response: Response, next: NextFunction) => {
        const post = await this.postService.search(request.params.key);
        response.send(post);
    };
    private findById = async (request: Request, response: Response, next: NextFunction) => {
        const post = await this.postService.findById(request.params.id);
        response.send(post);
    };
    private findAll = async (request: Request, response: Response, next: NextFunction) => {
        // We destructure the req.query object to get the page and limit variables from url
        const {page = 1, limit = 10} = request.query;
        const post = await this.postService.find(limit as number, page as number)
        response.send(post);
    };

    private create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const addPostResult = await this.postService.create(request.body);
            response.send(addPostResult);
        } catch (error) {
            next(error);
        }
    };

    private delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const deletePostResult = await this.postService.delete(request.params.id);
            response.send(deletePostResult);
        } catch (error) {
            next(error);
        }
    };

    private update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const updatePostResult = await this.postService.update(request.params.id, request.body);
            response.send(updatePostResult);
        } catch (error) {
            next(error);
        }
    };
}
