### General

Blog Post API is a post management demonstration application with CRUD functionality.

### Environment

- Node Js
- Type Script
- Frameworks (express, mongoose, mongoose-paginate-v2, jsonwebtoken, jest)

### How to run application locally

- Install packages: `npm install` (be sure that in your env have installed the [Node JS](https://nodejs.org/en/docs/guides/getting-started-guide))
- Run Node Application: `npm start`
- Run Mongo Database Container: `docker-compose up` (be sure that you have
  installed [Docker Desktop](https://www.docker.com/products/docker-desktop/) for your system)

### How to run application tests locally

- Run all tests `npm test`

### Endpoints

- Create a new blog post
    - POST http://localhost:3003/posts
        - Request Body
            ```
            {
                "title": "Post Title",
                "content": "Post Content",
                "author" :"Postianus Contentus"
            }
            ```
        - Response Body
            ```
            {
                "title": "Post Title",
                "content": "Post Content",
                "author": "Postianus Contentus",
                "createdAt": "2023-08-25T18:56:08.321Z",
                "id": "64e8f9487b164140e9d6a82b"
            }
            ```
- Update an existing blog post
    - POST http://localhost:3003/api/v1/posts/64e8f9487b164140e9d6a82b
        - Request Body
            ```
            {
                "title": "Post Title Updated",
                "content": "Post Content Updated",
                "author" :"Postianus Contentus Updated"
            }
            ```
        - Response Body
            ```
          {
              "title": "Post Title Updated",
              "content": "Post Content Updated",
              "author": "Postianus Contentus Updated",
              "createdAt": "2023-08-25T18:56:08.321Z",
              "id": "64e8f9487b164140e9d6a82b"
          }
          ```
- Retrieve a single blog post by its ID
    - GET http://localhost:3003/api/v1/posts/64e8f9487b164140e9d6a82b
        - Response Body
            ```
            {
              "title": "Post Title Updated",
              "content": "Post Content Updated",
              "author": "Postianus Contentus Updated",
              "createdAt": "2023-08-25T18:56:08.321Z",
              "id": "64e8f9487b164140e9d6a82b"
            }
          ```
- Retrieve all blog posts
    - GET http://localhost:3003/api/v1/posts
        - Response Body
          ```
          [
            {
               "title":"Post Title Updated",
               "content":"Post Content Updated",
               "author":"Postianus Contentus Updated",
               "createdAt":"2023-08-25T18:56:08.321Z",
               "id":"64e8f9487b164140e9d6a82b"
            },
            {
              "title": "Post Title 2",
              "content": "Post Content 2",
              "author": "Postianus Contentus 2",
              "createdAt": "2023-08-25T19:15:33.437Z",
              "id": "64e8fdd518f09d1c5f0b426f"
            }
          ]
          ```
- Retrieve all with limit and page
    - GET http://localhost:3003/api/v1/posts?page=1&limit=2
        - Response Body
          ```
            [
              {
              "title": "Post Title 3",
              "content": "Post Content 3",
              "author": "Postianus Contentus 3",
              "createdAt": "2023-08-25T19:30:32.249Z",
              "id": "64e901583af0474c85144d90"
              },
              {
              "title": "Post Title",
              "content": "Post Content",
              "author": "Postianus Contentus",
              "createdAt": "2023-08-25T19:30:24.046Z",
              "id": "64e901503af0474c85144d8e"
              }
            ]
          ```
- Search a blog post by title or content
    - GET http://localhost:3003/api/v1/posts/search/post title updated OR http://localhost:3003/posts/search/content Updated
        - Response Body
          ```
          [
            {
               "title": "Post Title Updated",
               "content": "Post Content Updated",
               "author": "Postianus Contentus Updated",
               "createdAt": "2023-08-25T18:56:08.321Z",
               "id": "64e8f9487b164140e9d6a82b"
            }
          ]
          ```
- Delete a blog post
    - DELETE http://localhost:3003/api/v1/posts/64e8f9487b164140e9d6a82b
    - Response Body
      ```
       {
           "title": "Post Title Updated",
           "content": "Post Content Updated",
           "author": "Postianus Contentus Updated",
           "createdAt": "2023-08-25T18:56:08.321Z",
           "id": "64e8f9487b164140e9d6a82b"
       }
      ```

### References

- [JSON Web Tokens](https://jwt.io/)
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [Mongoose](https://www.npmjs.com/package/mongoose)
- [Mongoose Paginate V2](https://www.npmjs.com/package/mongoose-paginate-v2)
- [Express](https://www.npmjs.com/package/express)
- [Jest](https://www.npmjs.com/package/jest)
- [Mongoose Paginate V2](https://www.npmjs.com/package/mongoose-paginate-v2)
- [Docker and MongoDB](https://www.mongodb.com/compatibility/docker)
- [Express web framework for Node.js](https://expressjs.com/)


### Nice to have

- Pagination and limit and sorting for find all service method -> installed (
  mongoose-paginate-v2)[https://www.npmjs.com/package/mongoose-paginate-v2] which could be improved for future usages
- Integration, Unit Tests - could be added more tests as well ass could be used testcontainers for end to end testing
  with the real db simulators
- JWT user authentication and authorization mechanism - integration could be done in the later versions
- Caching layer to increase the performance find all - integration could be done in the later versions
