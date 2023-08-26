import app from "../../src/app";
import request from 'supertest'
import User from "../../src/models/user/user.model";

const USER_ROUTE = '/api/v1/users'

// describe('#1 Return ERROR when username, email, password or role are missing', () => {
//     test('should throw error when there is no username', async () => {
//         const data = {
//             "password": "asdf@2023",
//             "email": "haik.hovhanisyan@gmail.com",
//             "role": "Admin"
//         };
//         const response = await request(app).post(USER_ROUTE).send(data)
//         expect(response.status).toBe(404)
//         expect(response.text).toContain('Username is mandatory')
//     })
//
//     test('should throw error when there is no password', async () => {
//         const data = {
//             "username": "Hayk Hovhannisyanm",
//             "email": "haik.hovhanisyan@gmail.com",
//             "role": "Admin"
//         };
//         const response = await request(app).post(USER_ROUTE).send(data)
//         expect(response.status).toBe(404)
//         expect(response.text).toContain('Password is mandatory')
//     })
//
//     test('should throw error when there is no email', async () => {
//         const data = {
//             "username": "Hayk Hovhannisyanm",
//             "password": "asdf@2023",
//             "role": "Admin"
//         };
//         const response = await request(app).post(USER_ROUTE).send(data)
//         expect(response.status).toBe(404)
//         expect(response.text).toContain('Email is mandatory')
//     })
//
//     test('should throw error when there is no role', async () => {
//         const data = {
//             "username": "Hayk Hovhannisyanm",
//             "password": "asdf@2023",
//             "email": "haik.hovhanisyan@gmail.com"
//         };
//         const response = await request(app).post(USER_ROUTE).send(data)
//         expect(response.status).toBe(404)
//         expect(response.text).toContain('Role is mandatory')
//     })
// })
describe('#2 Return SUCCESS, when username, email, password or role are valid', () => {
    let postId = '';
    beforeAll(() => {
        return User.deleteMany();
    });

    afterAll(() => {
        return User.deleteMany();
    });

    test('should register the user with valid username, email, password', async () => {
        const data = {
            "username": "Hayk Hovhannisyanm",
            "password": "asdf@2023",
            "email": "haik.hovhanisyan@gmail.com",
            "role": "Admin"
        };
        const response = await request(app).post(USER_ROUTE.concat('/register')).send(data)
        postId = response.body.id
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('username')
        expect(response.body).toHaveProperty('email')
        expect(response.body).toHaveProperty('password')
        expect(response.body).toHaveProperty('role')
    }, 10000)
})