import {MONGO} from "./constants/post/post.constants";
import {PostController} from "./controllers/post/post.controller";
import {PostService} from "./services/post/post.service";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import {handleErrors} from "./middleware/error-handler.middleware";
import mongoose from "mongoose";

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
            .connect(MONGO.url)
            .then(response => response.set("toJSON", {
                virtuals: true,
                transform: (_: any, converted: any) => {
                    delete converted._id;
                },
            }));
    }

    private setControllers() {
        const postController = new PostController(new PostService());
        this.app.use("/api/v1/posts", postController.router);
    }

    private setErrorHandlingMiddleware() {
        this.app.use(handleErrors);
    }
}

export default new App().app;
