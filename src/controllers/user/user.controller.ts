import {NextFunction, Request, Response, Router} from "express";

import {UserService} from "../../services/user/user.service";

export class UserController {
    public router = Router();

    constructor(private userService: UserService) {
        this.setRoutes();
    }

    public setRoutes() {
        this.router.route("/login").post(this.login);
        this.router.route("/logout").delete(this.logout);
        this.router.route("/register").post(this.register);
        this.router.route("/refreshToken").post(this.refreshToken);
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
    private refreshToken = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userService.refreshToken(request.body.username, request.body.token);
            response.send(user);
        } catch (error) {
            next(error);
        }
    };

    private logout = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userService.logout(request.body.token);
            response.send(user);
        } catch (error) {
            next(error);
        }
    };

}
