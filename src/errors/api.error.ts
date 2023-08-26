//free to extend the BaseError
import BaseError from "./base.error";
import {HttpStatusCode} from "../enums/http.statuses";

class APIError extends BaseError {
    constructor(name ='internal_error', httpCode = HttpStatusCode.INTERNAL_SERVER, isOperational = true, message = 'internal server error') {
        super(name, httpCode, isOperational, message);
    }
}

export default APIError;