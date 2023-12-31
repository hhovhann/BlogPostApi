import app from "../../src/app";
import request from 'supertest'
import Post from "../../src/models/post/post.model";
import {HttpStatusCode} from "../../src/enums/http.statuses";

let postId: string;
let accessToken: string;

const username = 'Hayk Hovhannisyan';
const password =  'asdf@2023';
const email = 'haik.hovhanisyan@gmail.com'
const role = 'ADMIN'

const POST_ROUTE = '/api/v1/posts'
const USER_ROUTE = '/api/v1/users'

describe('#1 Return ERROR when title or content are missing', () => {
    beforeAll(async () => {
        await generateAccessToken();
        return Post.deleteMany();
    });

    afterAll(() => {
        return Post.deleteMany();
    });

    test('should throw error when there is no title', async () => {
        const data = {"content": "Post Content", "author": "Postianus Contentus"};
        const response = await request(app).post(POST_ROUTE).auth(accessToken, {type: "bearer"}).send(data);
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.text).toContain('Title is mandatory')
    })

    test('should throw error when there is no content', async () => {
        const data = {"title": "Post Title", "author": "Postianus Contentus"};
        const response = await request(app).post(POST_ROUTE).auth(accessToken, {type: "bearer"}).send(data);
        expect(response.status).toBe(HttpStatusCode.BAD_REQUEST)
        expect(response.text).toContain('Content is mandatory')
    })
})
describe('#2 Return SUCCESS, when title and content are valid', () => {
    beforeAll(async () => {
        await generateAccessToken();
        return Post.deleteMany();
    });

    afterAll(() => {
        return Post.deleteMany();
    });

    test('should create the post with valid title, content and author', async () => {
        const data = {"title": "Post Title", "content": "Post Content", "author": "Postianus Contentus"};
        const response = await request(app).post(POST_ROUTE).auth(accessToken, {type: "bearer"}).send(data);
        postId = response.body.id
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('content')
        expect(response.body).toHaveProperty('author')
    }, 10000)

    test('should update created post', async () => {
        const data = {"title": "Post Title Updated", "content": "Post Content Updated", "author": "Postianus Contentus Updated"};
        const response = await request(app).put(POST_ROUTE.concat(`/${postId}`)).auth(accessToken, {type: "bearer"}).send(data);
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('content')
        expect(response.body).toHaveProperty('author')
    })

    test('should find post by updated post id', async () => {
        const response = await request(app).get(POST_ROUTE.concat(`/${postId}`)).send()
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body.title).toEqual('Post Title Updated')
        expect(response.body.content).toEqual('Post Content Updated')
        expect(response.body.author).toEqual('Postianus Contentus Updated')
    })

    test('should search post by title', async () => {
        const response = await request(app).get(POST_ROUTE.concat('/search/Post Title Updated')).send()
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveLength(1)
    })

    test('should search post by content', async () => {
        const response = await request(app).get(POST_ROUTE.concat('/search/Post Content Updated')).send()
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveLength(1)
    })

    test('should find all posts by page and limit', async () => {
        // const response = await request(app).get(POST_ROUTE).send()
        const response = await request(app).get(POST_ROUTE.concat('?page=1&limit=5')).send()
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveLength(1)
    })

    test('should delete updated post by id', async () => {
        const response = await request(app).delete(POST_ROUTE.concat(`/${postId}`)).auth(accessToken, {type: "bearer"}).send();
        expect(response.status).toBe(HttpStatusCode.OK)
        expect(response.body).toHaveProperty('title')
        expect(response.body).toHaveProperty('content')
        expect(response.body).toHaveProperty('author')
    })
})
async function registerUser() {
    await request(app).post(USER_ROUTE.concat('/register')).send({
        "username": username,
        "password": password,
        "email": email,
        "role": role
    })
}
async function generateAccessToken() {
    await registerUser();
    const response = await request(app).post(USER_ROUTE.concat('/login')).send({ "username": username, "password": password });
    accessToken =  response.body.accessToken;
}