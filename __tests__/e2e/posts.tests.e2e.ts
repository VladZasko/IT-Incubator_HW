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
    incorrectPostData
} from "./dataForTest/dataTestforPost";
import {postsTestManager} from "./utils/postsTestManager";
import {ErrorMessage, ERRORS_MESSAGES} from "./utils/types/errors";


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
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewBlog01]
            })

        const result2 = await blogsTestManager.createBlog(dataTestBlogCreate02)

        createdNewBlog02 = result2.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdNewBlog02, createdNewBlog01]
            })
    })

    it('should return 200 and empty array', async () => {
        await getRequest()
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
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
            title: incorrectPostData.emptyTitle,
            blogId: createdNewBlog01.id
        }
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with title more than 15 characters`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            title: incorrectPostData.tooLongTitle,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400,error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with empty shortDescription`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            shortDescription: incorrectPostData.emptyShortDescription,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with shortDescription more than 100 characters`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            shortDescription: incorrectPostData.tooLongShortDescription,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with empty content`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            content: incorrectPostData.emptyContent,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with content more than 1000 characters`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            content: incorrectPostData.tooLongContent,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with empty blogId`, async () => {
        const error:ErrorMessage = [ERRORS_MESSAGES.POST_BLOGID]

        await postsTestManager.createPost(dataTestPostCreate01, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with incorrect blogId`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            blogId: incorrectPostData.incorrectBlogId
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_BLOGID]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
    })

    it(`shouldn't create post with incorrect data`, async () => {
        const data: CreatePostModel = {
            ...dataTestPostCreate01,
            blogId: incorrectPostData.incorrectBlogId,
            title: incorrectPostData.emptyTitle,
            content: incorrectPostData.emptyContent,
            shortDescription: incorrectPostData.emptyShortDescription
        }

        const error:ErrorMessage = [
            ERRORS_MESSAGES.POST_SHORT_DESCRIPTION,
            ERRORS_MESSAGES.POST_TITLE,
            ERRORS_MESSAGES.POST_CONTENT,
            ERRORS_MESSAGES.POST_BLOGID
        ]

        await postsTestManager.createPost(data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })
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
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewPost01]
            })
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
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdNewPost02, createdNewPost01]
            })

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
            title: incorrectPostData.emptyTitle,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with title more than 30 characters`, async () => {
        const data = {
            ...dataTestPostCreate01,
            title: incorrectPostData.tooLongTitle,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_TITLE]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty shortDescription`, async () => {
        const data = {
            ...dataTestPostCreate01,
            shortDescription: incorrectPostData.emptyShortDescription,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blogs with shortDescription more than 100 characters`, async () => {
        const data = {
            ...dataTestPostCreate01,
            shortDescription: incorrectPostData.tooLongShortDescription,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_SHORT_DESCRIPTION]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty content`, async () => {
        const data = {
            ...dataTestPostCreate01,
            content: incorrectPostData.emptyContent,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with content more than 1000 characters`, async () => {
        const data = {
            ...dataTestPostCreate01,
            content: incorrectPostData.tooLongContent,
            blogId: createdNewBlog01.id
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_CONTENT]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update post with empty blogId`, async () => {

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_BLOGID]

        await postsTestManager.updatePost(createdNewPost01, dataTestPostCreate01, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blogs with incorrect blogId`, async () => {

        const data = {
            ...dataTestPostCreate01,
            blogId: incorrectPostData.incorrectBlogId
        }

        const error:ErrorMessage = [ERRORS_MESSAGES.POST_BLOGID]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

        await request(app)
            .get(`${RouterPaths.posts}/${createdNewPost01.id}`)
            .expect(HTTP_STATUSES.OK_200, createdNewPost01)
    })

    it(`shouldn't update blogs with incorrect data`, async () => {

        const data = {
            ...dataTestPostCreate01,
            blogId: incorrectPostData.incorrectBlogId,
            title: incorrectPostData.emptyTitle,
            content: incorrectPostData.emptyContent,
            shortDescription: incorrectPostData.emptyShortDescription
        }

        const error:ErrorMessage = [
            ERRORS_MESSAGES.POST_SHORT_DESCRIPTION,
            ERRORS_MESSAGES.POST_TITLE,
            ERRORS_MESSAGES.POST_CONTENT,
            ERRORS_MESSAGES.POST_BLOGID
        ]

        await postsTestManager.updatePost(createdNewPost01, data, HTTP_STATUSES.BAD_REQUEST_400, error)

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
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: [] })
    })

})




