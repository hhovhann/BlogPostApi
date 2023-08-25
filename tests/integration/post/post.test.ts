import Post from "../../../src/models/post/post.model";

jest.useFakeTimers()

describe('Create post',  () => {

    it('should create and return an object of second post details',   () => {
        const payload = {title: 'Pasta', content: 'Spaghetti alla Chitarra', author: 'Adriano Celentano'}

        expect(Post.create(payload)).not.toBeNull()

    }, 100000)
})
