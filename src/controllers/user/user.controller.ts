import {NextFunction, Request, Response, Router} from "express";

import {UserService} from "../../services/user/user.service";

export class UserController {
    public router = Router();

    constructor(private userService: UserService) {
        this.setRoutes();
    }

    public setRoutes() {
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
}
