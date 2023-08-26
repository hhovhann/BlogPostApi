import {NextFunction, Request, Response, Router} from "express";

import {UserService} from "../../services/user/user.service";

export class UserController {
    public router = Router();

    constructor(private userService: UserService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route("/login").post(this.login);
        this.router.route("/register").post(this.register);
    }

    private register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userService.register(request.body);
            response.send(user);
        } catch (error) {
            next(error);
        }
    };

    private login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userService.login(request.body.username, request.body.password);
            response.send(user);
        } catch (error) {
            next(error);
        }
    };
}
