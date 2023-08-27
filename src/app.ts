import {PostController} from "./controllers/post/post.controller";
import {UserController} from "./controllers/user/user.controller";
import {PostService} from "./services/post/post.service";
import {UserService} from "./services/user/user.service";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import {handleErrors} from "./middleware/error-handler.middleware";
import mongoose from "mongoose";

const dotenv = require('dotenv');
dotenv.config()

const uri = process.env.MONGO_DATABASE_URL as string

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.setConfig();
        this.setMongoConfig();
        this.setControllers();
        this.setErrorHandlingMiddleware();
    }

    private setConfig() {
        this.app.use(bodyParser.json({limit: "50mb"}));
        this.app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
        this.app.use(cors());
    }

    private setMongoConfig() {
        mongoose.Promise = global.Promise;
        mongoose
            .connect(uri)
            .then(response => response.set("toJSON", {
                virtuals: true,
                transform: (_: any, converted: any) => {
                    delete converted._id;
                },
            }));
    }

    private setControllers() {
        this.app.use("/api/v1/posts", new PostController(new PostService(), new UserService()).router);
        this.app.use("/api/v1/users", new UserController(new UserService()).router);
    }

    private setErrorHandlingMiddleware() {
        this.app.use(handleErrors);
    }
}

export default new App().app;
