import request from 'supertest'
import {app} from "../../src/app";
import {HTTP_STATUSES} from "../../src/utils";
import {CreateBlogModel} from "../../src/features/blogs/models/input/CreateBlogModel";
import {CreatePostModel} from "../../src/features/posts/models/CreatePostModel";
import {RouterPaths} from "../../src/routerPaths";
import {dataTestBlogCreate01, dataTestBlogCreate02, dataTestBlogUpdate01} from "./dataForTest/dataTestforBlog";
import {blogsTestManager} from "./utils/blogsTestManager";
import {
    dataTestPostCreate01,
    dataTestPostCreate02,
    dataTestPostUpdate01,
    incorrectData
} from "./dataForTest/dataTestforPost";
import {postsTestManager} from "./utils/postsTestManager";


const getRequest = () => {
    return request(app)
}
describe('/posts', () => {
    beforeAll(async () => {
        await getRequest().delete('/testing/all-data')
    })

    let createdNewBlog01: any= null
    let createdNewBlog02: any= null
    it(`should create blog for test post with correct input data`, async () => {

        const result = await blogsTestManager.createBlog(dataTestBlogCreate01)

        createdNewBlog01 = result.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [createdNewBlog01])

        const result2 = await blogsTestManager.createBlog(dataTestBlogCreate02)

        createdNewBlog02 = result2.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, [createdNewBlog01, createdNewBlog02])
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it('should return 404 fot not existing posts', async () => {
        await getRequest()
            .get(`${RouterPaths.posts}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create post with UNAUTHORIZED`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            blogId: createdNewBlog01.id
        }

        await request(app)
            .post(RouterPaths.posts)
            .set('authorization', 'Basic YWRtaW')
            .send(data)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't create post with empty title`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            title: incorrectData.emptyTitle,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with title more than 15 characters`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            title: incorrectData.tooLongTitle,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with empty shortDescription`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            shortDescription: incorrectData.emptyShortDescription,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with shortDescription more than 100 characters`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            shortDescription: incorrectData.tooLongShortDescription,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with empty content`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            content: incorrectData.emptyContent,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with content more than 1000 characters`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            content: incorrectData.tooLongContent,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with empty blogId`, async () => {
        await postsTestManager.createPost(dataTestPostCreate01, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    it(`shouldn't create post with incorrect blogId`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            blogId: incorrectData.incorrectBlogId
        }

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

    let createdNewPost01: any = null
    it(`should create post with correct input data`, async () => {
        const data = {
            ...dataTestPostCreate01,
            blogId: createdNewBlog01.id
        }

        const result = await postsTestManager.createPost(data)

        createdNewPost01 = result.createdEntity;

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [createdNewPost01])
    })

    let createdNewPost02:any = null
    it(`created one more posts`, async () => {
        const data = {
            ...dataTestPostCreate02,
            blogId: createdNewBlog02.id
        }

        const result = await postsTestManager.createPost(data)

        createdNewPost02 = result.createdEntity;

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [createdNewPost01, createdNewPost02])

        expect.setState({post2: result.createdEntity})
    })

    it ('should return 404 fot not existing posts for update', async () => {
        const {post2} = expect.getState()

        const data = {
            ...dataTestPostCreate01,
            blogId: createdNewBlog01.id
        }


        await getRequest()
            .put(`${RouterPaths.posts}/11515`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(data)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't update posts with UNAUTHORIZED`, async () => {
        const data = {
            ...dataTestPostCreate01,
            blogId: createdNewBlog01.id
        }

        await request(app)
            .put(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW')
            .send(data)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't update posts with empty title`, async () => {
        const data = {
            ...dataTestPostCreate01,
            title: incorrectData.emptyTitle,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with title more than 30 characters`, async () => {
        const data = {
            ...dataTestPostCreate01,
            title: incorrectData.tooLongTitle,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty shortDescription`, async () => {
        const data = {
            ...dataTestPostCreate01,
            shortDescription: incorrectData.emptyShortDescription,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blogs with shortDescription more than 100 characters`, async () => {
        const data = {
            ...dataTestPostCreate01,
            shortDescription: incorrectData.tooLongShortDescription,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty content`, async () => {
        const data = {
            ...dataTestPostCreate01,
            content: incorrectData.emptyContent,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with content more than 1000 characters`, async () => {
        const data = {
            ...dataTestPostCreate01,
            content: incorrectData.tooLongContent,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty blogId`, async () => {

        await postsTestManager.updatePost(createdNewPost01, dataTestPostCreate01, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blogs with incorrect blogId`, async () => {
        const data = {
            ...dataTestPostCreate01,
            blogId: incorrectData.incorrectBlogId
        }

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`should update blog with correct input module`, async () => {
        const data = {
            ...dataTestPostUpdate01,
            blogId: createdNewBlog01.id
        }

        await postsTestManager.updatePost(createdNewPost01, data)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost02.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost02)
    })

    it(`shouldn't delete  blog`, async () => {

        await request(app)
            .delete(`${RouterPaths.posts}/7779161`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`should delete both blog`, async () => {

        await request(app)
            .delete(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .delete(`${RouterPaths.posts}/${createdNewPost02.id}`)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.NO_CONTENT_204)


        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost02.id}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, [])
    })

})




