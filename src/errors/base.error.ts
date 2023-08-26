import {HttpStatusCode} from "../enums/http.statuses";

class BaseError extends Error {
    public readonly name: string
    public readonly message: string;
    public readonly status: HttpStatusCode;
    public readonly isOperational: boolean;

    constructor(name: string, status: HttpStatusCode, isOperational: boolean, message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.message = message;
        this.status = status;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

export default BaseError;