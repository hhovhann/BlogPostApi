import {HttpStatusCode} from "../enums/http.statuses";
import BaseError from "./base.error";

class HTTP400Error extends BaseError {
    constructor(message = 'bad request') {
        super('NOT FOUND', HttpStatusCode.BAD_REQUEST, true, message);
    }
}

export default HTTP400Error;