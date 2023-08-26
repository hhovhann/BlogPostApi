// // post.test.ts
//
// // const config  = require('config');
// const request = require('supertest');
// const app     = require('../../src/app');
//
//
// // const tokensConfig = config.get('test.tokens');
//
// it('delete user', async () => {
//   // const userByEmail = await request(app)
//   //     .get('/posts/get-by-email/user@test')
//   //     .set('Accept', 'application/json')
//   //     .set('Authorization', config.get('test.tokens.admin'));
//
//   const result = await testIt('get', `/posts`);
//   expect(result).toEqual([401, 403, 401, 200]);
// });
//
// // It's work
// // describe('get user by email', () => {
// //     testIt('get', '/users/get-by-email/user@test', [401, 403, 200]);
// // });
//
// // It's not work
// describe('get posts', async () => {
//     const userByEmail = await request(app)
//         .get('/users/get-by-email/user@test')
//         .set('Accept', 'application/json')
//         // .set('Authorization', config.get('test.tokens.admin'));
//
//     testIt('get', `/api/v1/posts`, [401, 403, 200]);
// });
// async function testIt(method = 'get', url = '/', statuses = [], body = {}) {
//     const testNames = ['unauthorized', 'user', 'admin'];
//     // const tokens = [null, tokensConfig.user, tokensConfig.admin];
//
//     for (let i = 0; i < testNames.length; i++) {
//         test(testNames[i], async () => {
//             const response = await request(app)
//                 [method](url)
//                 .set('Accept', 'application/json')
//                 // .set('Authorization', tokens[i])
//                 .send(body);
//             expect(response.statusCode).toBe(statuses[i]);
//         });
//     }
// }
// module.exports = testIt;