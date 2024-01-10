import request from 'supertest'
import {app} from "../../../src/app";
import {HTTP_STATUSES} from "../../../src/utils/utils";
import {RouterPaths} from "../../../src/routerPaths";
import {
    dataTestFeedbackCreate01, dataTestFeedbackUpdate, tooLongContent,
    tooShortContent
} from "./dataForTest/dataTestforFeedbacks";
import {ErrorMessage, ERRORS_MESSAGES} from "../../../src/utils/errors";
import {feedbacksTestManager} from "./utils/feedbacksTestManager";
import {usersTestManager} from "../users/utils/usersTestManager";
import {dataTestUserCreate01} from "../users/dataForTest/dataTestforUser";
import {dbControl} from "../../../src/db/db";
import {authTestManager} from "../auth/utils/authTestManager";
import {dataTestUserAuth} from "../auth/dataForTest/dataTestforAuth";
import {postsTestManager} from "../posts/utils/postsTestManager";
import {dataTestPostsCreate01} from "../posts/dataForTest/dataTestforPost";
import {blogsTestManager} from "../blogs/utils/blogsTestManager";
import {dataTestBlogCreate01} from "../blogs/dataForTest/dataTestforBlog";


const getRequest = () => {
    return request(app)
}
describe('/feedback tests', () => {
    beforeAll(async () => {
        await dbControl.run()
    })

    beforeEach(async () => {
        await getRequest().delete('/testing/all-data')
    })

    afterAll( async () => {
        await dbControl.stop()
    })

    it('should return 200 and empty array', async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
        const post = await postsTestManager.createPost({
            ...dataTestPostsCreate01,
            blogId: blog.createdEntity.id
        })
        await getRequest()
            .get(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it('should return 404 fot not existing comment', async () => {
        await getRequest()
            .get(`${RouterPaths.feedbacks}/1`)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it(`shouldn't create comment with incorrect JWT token`, async () => {

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
        const post = await postsTestManager.createPost({
            ...dataTestPostsCreate01,
            blogId: blog.createdEntity.id
        })

        await request(app)
            .post(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
            .set('authorization', `Bearer YWRtaW46cXdlcnR5`)
            .send(dataTestFeedbackCreate01)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't create comment with incorrect type authorization`, async () => {
        await usersTestManager.createUser(dataTestUserCreate01)

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
        const post = await postsTestManager.createPost({
            ...dataTestPostsCreate01,
            blogId: blog.createdEntity.id
        })
        const token = await authTestManager.createToken(dataTestUserAuth)

        await request(app)
            .post(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
            .set('authorization', `Basic ${token.createdEntity.accessToken}`)
            .send(dataTestFeedbackCreate01)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)
    })

    it(`shouldn't create comment with short content`, async () => {

        await usersTestManager.createUser(dataTestUserCreate01)

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
        const post = await postsTestManager.createPost({
            ...dataTestPostsCreate01,
            blogId: blog.createdEntity.id
        })
        const token = await authTestManager.createToken(dataTestUserAuth)

        const error:ErrorMessage = [ERRORS_MESSAGES.FEEDBACKS_CONTENT]

        await feedbacksTestManager
            .createComment(
                tooShortContent,
                post,
                token.createdEntity.accessToken,
                HTTP_STATUSES.BAD_REQUEST_400,
                error)

        await request(app)
            .get(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`shouldn't create comment with long content`, async () => {

        await usersTestManager.createUser(dataTestUserCreate01)

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
        const post = await postsTestManager.createPost({
            ...dataTestPostsCreate01,
            blogId: blog.createdEntity.id
        })
        const token = await authTestManager.createToken(dataTestUserAuth)

        const error:ErrorMessage = [ERRORS_MESSAGES.FEEDBACKS_CONTENT]

        await feedbacksTestManager
            .createComment(
                tooLongContent,
                post,
                token.createdEntity.accessToken,
                HTTP_STATUSES.BAD_REQUEST_400,
                error)

        await request(app)
            .get(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
            .expect(HTTP_STATUSES.OK_200,
                { pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
    })

    it(`should create comment`, async () => {

        await usersTestManager.createUser(dataTestUserCreate01)

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
        const post = await postsTestManager.createPost({
            ...dataTestPostsCreate01,
            blogId: blog.createdEntity.id
        })
        const token = await authTestManager.createToken(dataTestUserAuth)

        const result = await feedbacksTestManager.createComment(
            dataTestFeedbackCreate01,
            post.createdEntity,
            token.createdEntity.accessToken
        )

        const newComment = result.createdEntity
        await request(app)
            .get(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [newComment]
            })
    })

    // it(`shouldn't update comment with short content`, async () => {
    //
    //     await usersTestManager.createUser(dataTestUserCreate01)
    //
    //     const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
    //     const post = await postsTestManager.createPost({
    //         ...dataTestPostsCreate01,
    //         blogId: blog.createdEntity.id
    //     })
    //     const token = await authTestManager.createToken(dataTestUserAuth)
    //
    //     const comment = await feedbacksTestManager.createComment(
    //         dataTestFeedbackCreate01,
    //         post.createdEntity,
    //         token.createdEntity.accessToken
    //     )
    //
    //     const update = await feedbacksTestManager.updateComment(
    //         dataTestFeedbackUpdate,
    //         comment.createdEntity,
    //         token.createdEntity.accessToken
    //     )
    //
    //     await request(app)
    //         .get(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
    //         .expect(HTTP_STATUSES.OK_200, {
    //             pagesCount: 1,
    //             page: 1,
    //             pageSize: 10,
    //             totalCount: 1,
    //             items: [newComment]
    //         })
    // })

    it(`should update comment`, async () => {

        await usersTestManager.createUser(dataTestUserCreate01)

        const blog = await blogsTestManager.createBlog(dataTestBlogCreate01)
        const post = await postsTestManager.createPost({
            ...dataTestPostsCreate01,
            blogId: blog.createdEntity.id
        })
        const token = await authTestManager.createToken(dataTestUserAuth)

        const comment = await feedbacksTestManager.createComment(
            dataTestFeedbackUpdate,
            post.createdEntity,
            token.createdEntity.accessToken
        )

        const update = await feedbacksTestManager.updateComment(
            dataTestFeedbackUpdate,
            comment.createdEntity,
            token.createdEntity.accessToken
        )

        await request(app)
            .get(`${RouterPaths.posts}/${post.createdEntity.id}/comments`)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [{...comment.createdEntity, content: dataTestFeedbackUpdate.content}]
            })
    })


})




