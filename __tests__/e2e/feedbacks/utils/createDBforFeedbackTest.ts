import {HTTP_STATUSES} from "../../../../src/utils/utils";
import request from "supertest";
import {app} from "../../../../src/app";
import {RouterPaths} from "../../../../src/routerPaths";
import {blogsTestManager} from "./blogsTestManager";
import {dataTestBlogCreate01} from "../../blogs/dataForTest/dataTestforBlog";
import {dataTestPostsCreate01} from "../../posts/dataForTest/dataTestforPost";
import {postsTestManager} from "../../posts/utils/postsTestManager";
import {usersTestManager} from "../../users/utils/usersTestManager";
import {dataTestUserCreate01, dataTestUserCreate02} from "../../users/dataForTest/dataTestforUser";


export const createDBforFeedbackTest = {
    async createDB() {

        const resultBlog = await blogsTestManager.createBlog(dataTestBlogCreate01)

        let createdNewBlog01 = resultBlog.createdEntity;

        await request(app)
            .get(RouterPaths.blogs)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewBlog01]
            })

        const data = {
            ...dataTestPostsCreate01,
            blogId: createdNewBlog01.id
        }

        const resultPost = await postsTestManager.createPost(data)

        let createdNewPost01 = resultPost.createdEntity;

        await request(app)
            .get(RouterPaths.posts)
            .expect(HTTP_STATUSES.OK_200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdNewPost01]
            })

        const resultUser =
            await usersTestManager.createUser(dataTestUserCreate01)

        let createdNewUser01 = resultUser.createdEntity;

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [createdNewUser01]
                })

        const resultUser2 =
            await usersTestManager.createUser(dataTestUserCreate02)

        let createdNewUser02 = resultUser2.createdEntity;

        await request(app)
            .get(RouterPaths.users)
            .set('authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(HTTP_STATUSES.OK_200,
                {
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [ createdNewUser02, createdNewUser01]
                })

        const resultToken01 = await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:dataTestUserCreate01.login,
                password: dataTestUserCreate01.password
            })
            .expect(HTTP_STATUSES.OK_200)

        let tokenForUser01 = resultToken01.body.accessToken

        const responseData01 = {
            email: createdNewUser01.email,
            login: createdNewUser01.login,
            userId: createdNewUser01.id
        }

        await request(app)
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Bearer ${tokenForUser01}`)
            .expect(HTTP_STATUSES.OK_200, responseData01)

        const resultToken02 = await request(app)
            .post(`${RouterPaths.auth}/login`)
            .send({
                loginOrEmail:dataTestUserCreate02.login,
                password: dataTestUserCreate02.password
            })
            .expect(HTTP_STATUSES.OK_200)

        let tokenForUser02 = resultToken02.body.accessToken

        const responseData02 = {
            email: createdNewUser02.email,
            login: createdNewUser02.login,
            userId: createdNewUser02.id
        }

        await request(app)
            .get(`${RouterPaths.auth}/me`)
            .set('authorization', `Bearer ${tokenForUser02}`)
            .expect(HTTP_STATUSES.OK_200, responseData02)

        return {
            createdNewBlog01: createdNewBlog01,
            createdNewPost01: createdNewPost01,
            createdNewUser01: createdNewUser01,
            createdNewUser02: createdNewUser02,
            tokenForUser01: tokenForUser01,
            tokenForUser02: tokenForUser02
        }
    }
}