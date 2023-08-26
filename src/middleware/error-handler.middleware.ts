import {Request, Response} from "express";
import BaseError from "../errors/base.error";

export function handleErrors(baseError: BaseError, request: Request, response: Response) {
    const {status = 500, message} = baseError;
    return response.status(status).send(message);
}