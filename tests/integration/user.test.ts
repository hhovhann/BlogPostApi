import app from "../../src/app";
import request from 'supertest'
import User from "../../src/models/user/user.model";
import {HttpStatusCode} from "../../src/enums/http.statuses";

const USER_ROUTE = '/api/v1/users'

describe('#1 Return ERROR when username, email, password or role are missing', () => {
    test('should throw error when there is no username', async () => {
        const payload = {
            "password": "asdf@2023",
            "email": "haik.hovhanisyan@gmail.com",
            "role": "ADMIN"
        };
        const response = await request(app).post(USER_ROUTE.concat("/register")).send(payload)
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.text).toContain('Username is mandatory')
    })

    test('should throw error when there is no password', async () => {
        const payload = {
            "username": "Hayk Hovhannisyanm",
            "email": "haik.hovhanisyan@gmail.com",
            "role": "ADMIN"
        };
        const response = await request(app).post(USER_ROUTE.concat("/register")).send(payload)
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.text).toContain('Password is mandatory')
    })

    test('should throw error when there is no email', async () => {
        const payload = {
            "username": "Hayk Hovhannisyanm",
            "password": "asdf@2023",
            "role": "ADMIN"
        };
        const response = await request(app).post(USER_ROUTE.concat("/register")).send(payload)
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.text).toContain('Email is mandatory')
    })

    test('should throw error when there is no role', async () => {
        const payload = {
            "username": "Hayk Hovhannisyanm",
            "password": "asdf@2023",
            "email": "haik.hovhanisyan@gmail.com"
        };
        const response = await request(app).post(USER_ROUTE.concat("/register")).send(payload)
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.text).toContain('Role is mandatory')
    })
})
describe('#2 Return SUCCESS, when username, email, password or role are valid', () => {
    let userId = '';
    let username = '';
    beforeAll(() => {
        return User.deleteMany();
    });

    afterAll(() => {
        return User.deleteMany();
    });

    test('should register the user with valid username, email, password', async () => {
        const payload = {
            "username": "Hayk Hovhannisyan",
            "password": "asdf@2023",
            "email": "haik.hovhanisyan@gmail.com",
            "role": "ADMIN"
        };
        const response = await request(app).post(USER_ROUTE.concat('/register')).send(payload)
        userId = response.body.id
        username = response.body.username
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('username')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('password')
        expect(response.body).toHaveProperty('role')
    }, 10000)

    test('should login the user with valid username, password', async () => {
        const payload = { "username": username, "password": "asdf@2023"};
        const response = await request(app).post(USER_ROUTE.concat('/login')).send(payload)

        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('accessToken')
        expect(response.body).toHaveProperty('refreshToken')
    }, 10000)
})