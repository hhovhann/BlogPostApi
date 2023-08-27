import {IUser} from "../../interfaces/user/user.interface";
import User from "../../models/user/user.model";
import APIError from "../../errors/api.error";
import {HttpStatusCode} from "../../enums/http.statuses";
import jwt from 'jsonwebtoken';
import {NextFunction, Request, Response} from "express";

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

        const password = await bcrypt.hash(user.password, 10); //process.env.SALT
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
        jwt.verify(token, '3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e', (error, user) => {  // TODO replace with process.env.ACCESS_TOKEN_SECRET
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
        return jwt.sign(user, '3e9af42de397cfc9387a06972c28c23a1ac7e9a60fb6dc1f05295bc6057baf500672d4a13db5d04ea84bbc4c5679164a7723f3d49f516bb73dc3df6e3b768c8e', {expiresIn: "15m"}) // process.env.ACCESS_TOKEN_SECRET
    }

    /**
     * Generate JWT Refresh Token
     * TIP: require("REFRESH_TOKEN_SECRET").randomBytes(64).toString("hex")
     * @param user username for the current user
     */
    private generateRefreshToken(user: any) {
        return jwt.sign(user, '56a6d157ad7d2ee09e480960ae857e528ae546d156f47433b1afad162311c45aa520697b65d13a5c72891f6145ab1f2675886fc124027dc95f86073dd8fe1462', {expiresIn: "20m"}) // process.env.REFRESH_TOKEN_SECRET
    }
}
