import {IUser} from "../../interfaces/user/user.interface";
import User from "../../models/user/user.model";
import APIError from "../../errors/api.error";
import {HttpStatusCode} from "../../enums/http.statuses";
import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";

const dotenv = require('dotenv');
dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

const bcrypt = require('bcrypt');
let refreshTokens = [] as string[]; // can use Redis cash for this reason


export class UserService {

    /**
     * Register User
     * **/
    public async register(user: IUser): Promise<IUser> {
        // Validate username, email, password, and role fields
        if (!user.username) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Username is mandatory');
        }

        if (!user.email) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Email is mandatory');
        }

        if (!user.password) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Password is mandatory');
        }

        if (!user.role) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Role is mandatory');
        }

        const password = await bcrypt.hash(user.password, 10);
        const newUser = new User({
            username: user.username,
            email: user.email,
            password: password,
            role: user.role
        });
        return newUser.save();
    }

    /**
     * Login User
     * **/
    public async login(username: string, password: string): Promise<any> {
        // Validate username, password
        if (!username) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Username is mandatory');
        }

        if (!password) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Email is mandatory');
        }

        const user = await User.findOne({username: username}).exec();

        // Checks to see if the user exists in the list of registered users
        if (user == null) {
            throw new APIError('NOT FOUND', HttpStatusCode.NOT_FOUND, true, `User by provided username: ${username} not found.`);
        }

        if (await bcrypt.compare(password, user.password)) {
            // Generates new accessToken and refreshTokens
            const accessToken = this.generateAccessToken({user: username})
            const refreshToken = this.generateRefreshToken({user: username})
            // Add refresh token to the local storage(possibly redis cache in next releases)
            refreshTokens.push(refreshToken);

            return {accessToken: accessToken, refreshToken: refreshToken};
        } else {
            throw new APIError('UNAUTHORIZED', HttpStatusCode.UNAUTHORIZED, true, `Password Incorrect.`);
        }
    }

    /**
     * Retrieves new Refresh token after the Access Token expires
     */
    public async refreshToken(username: string, token: string): Promise<any> {
        if (!refreshTokens.includes(token)) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Refresh Token Invalid');
        }

        refreshTokens = refreshTokens.filter((current) => current != token) // remove the old refreshToken from the refreshTokens list

        // Generate new accessToken and refreshTokens
        const accessToken = this.generateAccessToken({user: username})
        const refreshToken = this.generateRefreshToken({user: username})
        // Add refresh token to the local storage(possibly redis cache in next releases)
        refreshTokens.push(refreshToken);
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        };
    }

    /**
     * Retires refresh tokens on logout
     */
    public async logout(token: string): Promise<void> {
        if (!refreshTokens.includes(token)) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Refresh Token Invalid');
        }
        refreshTokens = refreshTokens.filter((current) => current != token)  // remove the old refreshToken from the refreshTokens list
    }

    /**
     * Validate authorization token
     */
    public validateToken(request: Request, response: Response, next: NextFunction) {
        // Get token from request header
        const authHeader = request.headers['authorization'] as string
        if (!authHeader || authHeader.trim().length === 0) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Authorization header is not provided');
        }
        // The request header contains the token "Bearer <token>", split the string and use the second value in the split array.
        const token = authHeader.split(" ")[1]
        if (!token || token.trim().length === 0) {
            throw new APIError('BAD REQUEST', HttpStatusCode.BAD_REQUEST, true, 'Access Token isn\'t provided');
        }
        // Verify token with secret
        jwt.verify(token, ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                throw new APIError('FORBIDDEN', HttpStatusCode.FORBIDDEN, true, 'The access token is invalid');
            } else {
                next()
            }
        })
    }

    /**
     * Generate JWT Access Token
     * TIP: require("ACCESS_TOKEN_SECRET").randomBytes(64).toString("hex")
     * @param user username for the current user
     */
    private generateAccessToken(user: any) {
        return jwt.sign(user, ACCESS_TOKEN_SECRET, {expiresIn: "15m"})
    }

    /**
     * Generate JWT Refresh Token
     * TIP: require("REFRESH_TOKEN_SECRET").randomBytes(64).toString("hex")
     * @param user username for the current user
     */
    private generateRefreshToken(user: any) {
        return jwt.sign(user, REFRESH_TOKEN_SECRET, {expiresIn: "20m"})
    }
}
